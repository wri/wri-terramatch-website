import { useT } from "@transifex/react";
import { camelCase } from "lodash";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { OrgFormDetails } from "@/components/elements/Inputs/FinancialTableInput/types";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { pruneEntityCache } from "@/connections/Entity";
import { FormModelType } from "@/connections/util/Form";
import { CurrencyProvider } from "@/context/currency.provider";
import { toFramework } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { usePutV2FormsENTITYUUIDSubmit } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { getEntityDetailPageLink, isEntityReport, singularEntityNameToPlural } from "@/helpers/entity";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { EntityName, isSingularEntityName } from "@/types/common";

interface EditEntityFormProps {
  entityName: EntityName;
  entityUUID: string;
  entity: Record<string, any>;
}

const EditEntityForm = ({ entity, entityName, entityUUID }: EditEntityFormProps) => {
  const t = useT();
  const router = useRouter();

  const { formData, isLoading, loadError } = useEntityForm(entityName, entityUUID);
  const framework = toFramework(formData?.data.framework_key);
  const entityData = formData?.data;

  const model = useMemo(() => {
    const model = camelCase(
      isSingularEntityName(entityName) ? singularEntityNameToPlural(entityName) : entityName
    ) as FormModelType;
    return { model, uuid: entityUUID };
  }, [entityName, entityUUID]);

  const mode = router.query.mode as string | undefined; //edit, provide-feedback-entity, provide-feedback-change-request
  const isReport = isEntityReport(entityName);

  const feedbackFields = useMemo(
    () =>
      mode?.includes("provide-feedback")
        ? entityData?.update_request?.feedback_fields ?? entityData?.feedback_fields ?? []
        : [],
    [entityData?.feedback_fields, entityData?.update_request?.feedback_fields, mode]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.data.form_uuid, feedbackFields);
  const defaultValues = useDefaultValues(formData?.data, fieldsProvider);

  const organisation = entity?.organisation;

  const { updateEntity, error, isSuccess, isUpdating } = useFormUpdate(entityName, entityUUID);
  const { mutate: submitEntity, isLoading: isSubmitting } = usePutV2FormsENTITYUUIDSubmit({
    onSuccess() {
      // When an entity is submitted via form, we want to forget the cached copy we might have from
      // v3 so it gets re-fetched when a component needs it.
      pruneEntityCache(entityName, entityUUID);

      if (mode === "edit" || mode?.includes("provide-feedback")) {
        router.push(getEntityDetailPageLink(entityName, entityUUID));
      } else {
        router.replace(`/entity/${entityName}/edit/${entityUUID}/confirm`);
      }
    }
  });

  const reportingWindow = useReportingWindow(entity?.due_at);
  const formTitle =
    entityName === "site-reports"
      ? t("{siteName} Site Report", { siteName: entity.site.name })
      : entityName === "financial-reports"
      ? t("{orgName} Financial Report", { orgName: organisation?.name })
      : `${entityData?.form_title} ${isReport ? reportingWindow : ""}`;
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
        for (const fieldId of fieldsProvider.fieldIds(stepId)) {
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

  if (loadError != null) return notFound();

  return (
    <LoadingContainer loading={isLoading || !providerLoaded}>
      <CurrencyProvider>
        {providerLoaded && (
          <WizardForm
            framework={framework}
            models={model}
            fieldsProvider={fieldsProvider}
            orgDetails={orgDetails}
            errors={error}
            onBackFirstStep={router.back}
            onCloseForm={() => router.push("/home")}
            onChange={(data, closeAndSave?: boolean) =>
              updateEntity({
                answers: normalizedFormData(data, fieldsProvider),
                ...(closeAndSave ? { continue_later_action: true } : {})
              })
            }
            formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
            onSubmit={() =>
              submitEntity({
                pathParams: {
                  entity: entityName,
                  uuid: entityUUID
                }
              })
            }
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
