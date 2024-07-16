import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

import WizardForm from "@/components/extensive/WizardForm";
import {
  GetV2FormsENTITYUUIDResponse,
  usePutV2FormsENTITYUUID,
  usePutV2FormsENTITYUUIDSubmit
} from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { getEntityDetailPageLink, isEntityReport, pluralEntityNameToSingular } from "@/helpers/entity";
import {
  useGetCustomFormSteps,
  useNormalizedFormDefaultValue
} from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { EntityName } from "@/types/common";

interface EditEntityFormProps {
  entityName: EntityName;
  entityUUID: string;
  entity: Record<string, any>;
  formData: GetV2FormsENTITYUUIDResponse;
}

export const EditEntityForm = ({ entityName, entityUUID, entity, formData }: EditEntityFormProps) => {
  const t = useT();
  const router = useRouter();

  const mode = router.query.mode as string | undefined; //edit, provide-feedback-entity, provide-feedback-change-request
  const isReport = isEntityReport(entityName);

  const { mutate: updateEntity, error, isSuccess, isLoading: isUpdating } = usePutV2FormsENTITYUUID({});
  const { mutate: submitEntity, isLoading: isSubmitting } = usePutV2FormsENTITYUUIDSubmit({
    onSuccess() {
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
    mode?.includes("provide-feedback") ? feedbackFields : undefined
  );

  const defaultValues = useNormalizedFormDefaultValue(
    formData?.update_request?.content ?? formData?.answers,
    formSteps,
    entity.migrated
  );

  const reportingWindow = useReportingWindow(entity?.due_at);
  const formTitle = `${formData.form?.title} ${isReport ? reportingWindow : ""}`;

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

  return (
    <WizardForm
      steps={formSteps!}
      errors={error}
      onBackFirstStep={router.back}
      onCloseForm={() => router.push("/home")}
      onChange={data =>
        updateEntity({
          pathParams: { uuid: entityUUID, entity: entityName },
          body: { answers: normalizedFormData(data, formSteps!) }
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
  );
};
