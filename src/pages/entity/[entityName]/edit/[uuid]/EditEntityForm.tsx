import { useT } from "@transifex/react";
import { camelCase, defaults } from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { OrgFormDetails } from "@/components/elements/Inputs/FinancialTableInput/types";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { pruneEntityCache } from "@/connections/Entity";
import { FormModelType } from "@/connections/util/Form";
import { CurrencyProvider } from "@/context/currency.provider";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { GetV2FormsENTITYUUIDResponse, usePutV2FormsENTITYUUIDSubmit } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import {
  getEntityDetailPageLink,
  isEntityReport,
  pluralEntityNameToSingular,
  singularEntityNameToPlural
} from "@/helpers/entity";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useFormDefaultValues, useGetCustomFormSteps } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { EntityName, isSingularEntityName } from "@/types/common";

interface EditEntityFormProps {
  framework: Framework;
  entityName: EntityName;
  entityUUID: string;
  entity: Record<string, any>;
  formData: GetV2FormsENTITYUUIDResponse;
}

const EditEntityForm = ({ entityName, entityUUID, entity, formData }: EditEntityFormProps) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const organisation = entity?.organisation;

  const mode = router.query.mode as string | undefined; //edit, provide-feedback-entity, provide-feedback-change-request
  const isReport = isEntityReport(entityName);

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

  const feedbackFields = formData?.update_request?.feedback_fields ?? formData?.feedback_fields ?? [];

  const formSteps = useGetCustomFormSteps(
    formData.form,
    {
      entityName: pluralEntityNameToSingular(entityName),
      entityUUID
    },
    framework,
    mode?.includes("provide-feedback") ? feedbackFields : undefined
  );

  const sourceData = useMemo(
    () => defaults(formData?.update_request?.content ?? {}, formData?.answers),
    [formData?.answers, formData?.update_request?.content]
  );
  const defaultValues = useFormDefaultValues(sourceData, formSteps);

  const reportingWindow = useReportingWindow(entity?.due_at);
  const formTitle =
    entityName === "site-reports"
      ? t("{siteName} Site Report", { siteName: entity.site.name })
      : entityName === "financial-reports"
      ? t("{orgName} Financial Report", { orgName: organisation?.name })
      : `${formData.form?.title} ${isReport ? reportingWindow : ""}`;
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
    const stepIndex =
      mode == null ? 0 : formSteps!.findIndex(step => step.fields.find(field => field.feedbackRequired) != null);

    return {
      initialStepIndex: stepIndex < 0 ? undefined : stepIndex,
      disableInitialAutoProgress: stepIndex >= 0
    };
  }, [formSteps, mode]);

  const model = useMemo(() => {
    const model = camelCase(
      isSingularEntityName(entityName) ? singularEntityNameToPlural(entityName) : entityName
    ) as FormModelType;
    return { model, uuid: entityUUID };
  }, [entityName, entityUUID]);
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.form_uuid);

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

  return (
    <LoadingContainer loading={!providerLoaded}>
      <CurrencyProvider>
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
              answers: normalizedFormData(data, formSteps!),
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
      </CurrencyProvider>
    </LoadingContainer>
  );
};

export default EditEntityForm;
