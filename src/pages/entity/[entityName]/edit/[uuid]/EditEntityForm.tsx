import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { formatDateForEnGb } from "@/admin/apiProvider/utils/entryFormat";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { EntityFullDto, pruneEntityCache, ReportFullDto, useFullEntity } from "@/connections/Entity";
import { FormEntity } from "@/connections/Form";
import { CurrencyProvider } from "@/context/currency.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import {
  DisturbanceReportFullDto,
  FinancialReportFullDto,
  SiteReportFullDto,
  SrpReportFullDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { normalizedFormData } from "@/helpers/customForms";
import { getEntityDetailPageLink, isEntityReport } from "@/helpers/entity";
import { shouldDeferReportValidation } from "@/helpers/formValidation";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useOnUnmount } from "@/hooks/useOnMount";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import ApiSlice from "@/store/apiSlice";
import { EntityName } from "@/types/common";
import {
  getAnalyticsUserRole,
  isReportReopenedStatus,
  resolveReportEntityTypeFromEntityName,
  trackReportAnalyticsEvent
} from "@/utils/analytics/reportAnalytics";
import Log from "@/utils/log";

interface EditEntityFormProps {
  entityName: EntityName;
  entityUUID: string;
}

type TaskReport = Exclude<ReportFullDto, DisturbanceReportFullDto | FinancialReportFullDto>;
const isTaskReport = (formEntityName: FormEntity, entity: EntityFullDto): entity is TaskReport => {
  if (!formEntityName.includes("Report")) return false;
  if (formEntityName === "disturbanceReports" || formEntityName === "financialReports") return false;
  return true;
};

const EditEntityForm = ({ entityName, entityUUID }: EditEntityFormProps) => {
  const t = useT();
  const router = useRouter();
  const { openToast } = useToastContext();
  const loadFailureHandled = useRef(false);
  const reportOpenTracked = useRef(false);
  /** Only navigate to /confirm after an explicit Submit, not any future entity PATCH. */
  const pendingSubmissionConfirmationRef = useRef(false);
  const {
    model,
    formData,
    framework,
    feedbackFields,
    fieldsProvider,
    defaultValues,
    isFormLoading: isLoading,
    providerLoaded,
    loadFailure,
    formLoadFailure
  } = useEntityFormSetup(entityName, entityUUID);

  const [
    entityLoaded,
    { data: entity, update: updateEntity, isUpdating: isSubmitting, updateFailure: submissionFailure }
  ] = useFullEntity(model.model, model.uuid);
  const { updateEntityAnswers, entityAnswersUpdating } = useFormUpdate(model.model, entityUUID);
  const { isLoading: orgLoading, orgDetails, projectDetails } = useProjectOrgFormData(entityName, entity);

  // When we unmount, clear the cache of the base entity so it gets fetched again when needed.
  useOnUnmount(() => {
    pruneEntityCache(model.model, entityUUID);
    if (entity != null && isTaskReport(model.model, entity) && entity.taskUuid != null) {
      ApiSlice.pruneCache("tasks", [entity.taskUuid]);
    }
    ApiSlice.pruneCache("treeSpecies");
    ApiSlice.pruneCache("seedings");
    ApiSlice.pruneCache("trackings");
    ApiSlice.pruneCache("media");
    ApiSlice.pruneCache("treeReportCounts");
    ApiSlice.pruneCache("invasives");
  });

  const isReport = isEntityReport(entityName);

  const submitEntity = useCallback(() => {
    pendingSubmissionConfirmationRef.current = true;
    updateEntity({ status: "awaiting-approval" });
    ApiSlice.pruneCache("actions");
  }, [updateEntity]);

  useRequestComplete(
    isSubmitting,
    submissionFailure,
    useCallback(
      failure => {
        if (!pendingSubmissionConfirmationRef.current) return;
        pendingSubmissionConfirmationRef.current = false;
        if (failure == null) {
          router.replace(`/entity/${entityName}/edit/${entityUUID}/confirm`);
        } else {
          Log.error("Request failed: Submission failed", failure);
          openToast(t("Submission failed"), ToastType.ERROR);
        }
      },
      [entityName, entityUUID, openToast, router, t]
    )
  );

  const reportingWindow = useReportingWindow(framework, (entity as ReportFullDto)?.dueAt ?? undefined);
  const disturbanceReportDate =
    (entity as DisturbanceReportFullDto)?.entries?.find(({ name }) => name === "disturbance-start-date")?.value ?? null;
  const formTitle =
    entityName === "site-reports"
      ? t("{siteName} Site Report", { siteName: (entity as SiteReportFullDto)?.siteName })
      : entityName === "financial-reports"
      ? t("{orgName} Financial Report", { orgName: entity?.organisationName })
      : entityName === "disturbance-reports"
      ? `${t("Disturbance Report")} ${formatDateForEnGb(disturbanceReportDate)}`
      : entityName === "srp-reports"
      ? t("{projectName} Socio-Economic Report", { projectName: (entity as SrpReportFullDto)?.projectName })
      : `${formData?.formTitle} ${isReport ? reportingWindow : ""}`;
  const formSubtitle =
    entityName === "site-reports" ? t("Reporting Period: {reportingWindow}", { reportingWindow }) : undefined;

  const initialStepProps = useMemo(() => {
    if (providerLoaded && feedbackFields != null) {
      for (const [stepIndex, stepId] of fieldsProvider.stepIds().entries()) {
        for (const fieldId of fieldsProvider.fieldNames(stepId)) {
          if (fieldsProvider.feedbackRequired(fieldId)) {
            return { initialStepIndex: stepIndex, disableInitialAutoProgress: true };
          }
        }
      }
    }

    if (entity?.status === "approved") {
      return { initialStepIndex: fieldsProvider.stepIds().length, disableInitialAutoProgress: true };
    }

    return { initialStepIndex: 0, disableInitialAutoProgress: false };
  }, [entity?.status, feedbackFields, fieldsProvider, providerLoaded]);

  const onChange = useCallback(
    (data: Dictionary<any>) => {
      updateEntityAnswers({ answers: normalizedFormData(data, fieldsProvider) });
    },
    [fieldsProvider, updateEntityAnswers]
  );

  const hasLoadFailure = loadFailure != null || formLoadFailure != null;

  useEffect(() => {
    if (!entityLoaded || entity == null || !isReport || reportOpenTracked.current) return;

    const reportEntityType = resolveReportEntityTypeFromEntityName(entityName);
    if (reportEntityType == null) return;

    reportOpenTracked.current = true;
    const analyticsContext = {
      entityType: reportEntityType,
      entityId: entityUUID,
      userRole: getAnalyticsUserRole()
    };

    trackReportAnalyticsEvent("report_opened", analyticsContext);

    if (isReportReopenedStatus(entity.status)) {
      trackReportAnalyticsEvent("report_reopened", analyticsContext);
    }
  }, [entity, entityLoaded, entityName, entityUUID, isReport]);

  useEffect(() => {
    if (!hasLoadFailure || loadFailureHandled.current) return;
    loadFailureHandled.current = true;
    Log.error("Form data load failed", { loadFailure, formLoadFailure });
    openToast(t("We couldn't load this form."), ToastType.ERROR);
    router.replace("/home");
  }, [formLoadFailure, hasLoadFailure, loadFailure, openToast, router, t]);

  if (hasLoadFailure) return null;

  return (
    <LoadingContainer loading={isLoading || !providerLoaded || orgLoading || !entityLoaded}>
      <CurrencyProvider>
        {providerLoaded && (
          <WizardForm
            framework={framework}
            models={model}
            fieldsProvider={fieldsProvider}
            orgDetails={orgDetails}
            projectDetails={projectDetails}
            onBackFirstStep={router.back}
            onCloseForm={() => router.push("/home")}
            onChange={onChange}
            formStatus={entityAnswersUpdating ? "saving" : "saved"}
            onSubmit={submitEntity}
            submitButtonDisable={isSubmitting}
            defaultValues={defaultValues}
            title={formTitle}
            subtitle={formSubtitle}
            summaryOptions={{
              title: t("Review Details"),
              downloadButtonText: t("Download")
            }}
            roundedCorners
            saveAndCloseModal={{
              onConfirm() {
                showToast({
                  label: t("Draft saved"),
                  type: "success",
                  placement: "bottom",
                  duration: 5000,
                  maxWidth: "auto"
                });
                router.push(getEntityDetailPageLink(entityName, entityUUID));
              }
            }}
            {...initialStepProps}
            cancelEditForm={() => router.push(getEntityDetailPageLink(entityName, entityUUID))}
            redirectEntityPage={getEntityDetailPageLink(entityName, entityUUID)}
            entity={entity}
            deferValidation={shouldDeferReportValidation(entityName, entity?.status)}
          />
        )}
      </CurrencyProvider>
    </LoadingContainer>
  );
};

export default EditEntityForm;
