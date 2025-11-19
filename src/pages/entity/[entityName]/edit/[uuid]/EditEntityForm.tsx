import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { formatDateForEnGb } from "@/admin/apiProvider/utils/entryFormat";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullEntity } from "@/connections/Entity";
import { FormEntity } from "@/connections/Form";
import { CurrencyProvider } from "@/context/currency.provider";
import { toFramework } from "@/context/framework.provider";
import { OrgFormDetails, ProjectFormDetails, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { normalizedFormData } from "@/helpers/customForms";
import { getEntityDetailPageLink, isEntityReport, v3EntityName } from "@/helpers/entity";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

interface EditEntityFormProps {
  entityName: EntityName;
  entityUUID: string;
  entity: Record<string, any>;
}

const EditEntityForm = ({ entity, entityName, entityUUID }: EditEntityFormProps) => {
  const t = useT();
  const router = useRouter();

  const model = useMemo(
    () => ({ model: v3EntityName(entityName) as FormEntity, uuid: entityUUID }),
    [entityName, entityUUID]
  );

  const [, { update: updateEntity, isUpdating: isSubmitting, updateFailure: submissionFailure }] = useFullEntity(
    model.model,
    model.uuid
  );
  const { updateEntityAnswers, entityAnswersUpdating } = useFormUpdate(model.model, entityUUID);
  const { formData, isLoading, loadFailure, formLoadFailure } = useEntityForm(model.model, entityUUID);

  const framework = toFramework(formData?.frameworkKey);

  const mode = router.query.mode as string | undefined; //edit, provide-feedback-entity, provide-feedback-change-request
  const isReport = isEntityReport(entityName);

  const feedbackFields = useMemo(
    () => (mode?.includes("provide-feedback") ? formData?.feedbackFields ?? [] : []),
    [formData?.feedbackFields, mode]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.formUuid, feedbackFields);
  const defaultValues = useDefaultValues(formData, fieldsProvider);

  const organisation = entity?.organisation;

  const submitEntity = useCallback(() => {
    updateEntity({ status: "awaiting-approval" });
  }, [updateEntity]);
  useRequestSuccess(
    isSubmitting,
    submissionFailure,
    useCallback(() => {
      if (mode === "edit" || mode?.includes("provide-feedback")) {
        router.push(getEntityDetailPageLink(entityName, entityUUID));
      } else {
        router.replace(`/entity/${entityName}/edit/${entityUUID}/confirm`);
      }
    }, [entityName, entityUUID, mode, router]),
    "Submission failed"
  );

  const reportingWindow = useReportingWindow(framework, entity?.due_at);
  const disturbanceReportDate = entity?.entries?.find((entry: any) => entry.name === "date-of-disturbance")?.value;
  const formTitle =
    entityName === "site-reports"
      ? t("{siteName} Site Report", { siteName: entity.site.name })
      : entityName === "financial-reports"
      ? t("{orgName} Financial Report", { orgName: organisation?.name })
      : entityName === "disturbance-reports"
      ? `${t("Disturbance Report")} ${formatDateForEnGb(disturbanceReportDate)}`
      : entityName === "srp-reports"
      ? t("{projectName} Socio-Economic Report", { projectName: entity.project.name })
      : `${formData?.formTitle} ${isReport ? reportingWindow : ""}`;
  const formSubtitle =
    entityName === "site-reports" ? t("Reporting Period: {reportingWindow}", { reportingWindow }) : undefined;

  const saveAndCloseModalMapping: any = {
    projects: t(
      "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the 'My Projects' section. Would you like to close this form and continue later?"
    ),
    sites: t(
      "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the sites section under your project page. Would you like to close this form and continue later?"
    ),
    nurseries: t(
      "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the nurseries section under your project page. Would you like to close this form and continue later?"
    )
  };

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

    return { initialStepIndex: 0, disableInitialAutoProgress: false };
  }, [feedbackFields, fieldsProvider, providerLoaded]);

  const orgDetails = useMemo(
    (): OrgFormDetails => ({
      uuid: organisation?.uuid,
      currency: entityName === "financial-reports" ? entity?.currency : organisation?.currency,
      startMonth: entityName === "financial-reports" ? entity?.fin_start_month : organisation?.fin_start_month
    }),
    [
      entity?.currency,
      entity?.fin_start_month,
      entityName,
      organisation?.currency,
      organisation?.fin_start_month,
      organisation?.uuid
    ]
  );

  const projectDetails = useMemo((): ProjectFormDetails => ({ uuid: entity?.project?.uuid }), [entity?.project?.uuid]);

  const onChange = useCallback(
    (data: Dictionary<any>, closeAndSave?: boolean) => {
      updateEntityAnswers({
        answers: normalizedFormData(data, fieldsProvider),
        ...(closeAndSave ? { continue_later_action: true } : {})
      });
    },
    [fieldsProvider, updateEntityAnswers]
  );

  if (loadFailure != null || formLoadFailure != null) {
    Log.error("Form data load failed", { loadFailure, formLoadFailure });
    return notFound();
  }

  return (
    <LoadingContainer loading={isLoading || !providerLoaded}>
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
            tabOptions={{
              markDone: true,
              disableFutureTabs: true
            }}
            summaryOptions={{
              title: t("Review Details"),
              downloadButtonText: t("Download")
            }}
            roundedCorners
            saveAndCloseModal={{
              content:
                saveAndCloseModalMapping[entityName] ??
                t(
                  "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the reporting tasks section under your project page. Would you like to close this form and continue later?"
                ),
              onConfirm() {
                router.push(getEntityDetailPageLink(entityName, entityUUID));
              }
            }}
            {...initialStepProps}
          />
        )}
      </CurrencyProvider>
    </LoadingContainer>
  );
};

export default EditEntityForm;
