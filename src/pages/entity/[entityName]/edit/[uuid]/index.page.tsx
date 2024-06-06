import { useT } from "@transifex/react";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { useMemo } from "react";

import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2ENTITYUUID,
  useGetV2FormsENTITYUUID,
  usePutV2FormsENTITYUUID,
  usePutV2FormsENTITYUUIDSubmit
} from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { getEntityDetailPageLink, isEntityReport, pluralEntityNameToSingular } from "@/helpers/entity";
import {
  useGetCustomFormSteps,
  useNormalizedFormDefaultValue
} from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { useGetReportingWindow } from "@/hooks/useGetReportingWindow";
import { EntityName } from "@/types/common";

/**
 * Use this page to edit the following entities for a given entity_name and entity_uuid
 * entity_name = projects/sites/nurseries/project-reports/site-reports/nursery-reports
 */
const EditEntityPage = () => {
  const t = useT();
  const router = useRouter();
  const { getReportingWindow } = useGetReportingWindow();
  const entityName = router.query.entityName as EntityName;
  const entityUUID = router.query.uuid as string;
  const mode = router.query.mode as string; //edit, provide-feedback-entity, provide-feedback-change-request

  const isReport = isEntityReport(entityName);
  const { data: entityData } = useGetV2ENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });
  const entity = entityData?.data || {}; //Do not abuse this since forms should stay entity agnostic!

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

  const {
    data,
    isLoading: isLoading,
    isError
  } = useGetV2FormsENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID },
    queryParams: { lang: router.locale }
  });
  //@ts-ignore
  const formData = (data?.data || {}) as GetV2FormsENTITYUUIDResponse;

  // @ts-ignore
  const feedbackFields = formData?.update_request?.feedback_fields ?? formData?.feedback_fields ?? [];

  const formSteps = useGetCustomFormSteps(
    formData.form,
    {
      entityName: pluralEntityNameToSingular(entityName),
      entityUUID
    },
    //@ts-ignore
    mode?.includes("provide-feedback") ? feedbackFields : undefined
  );

  const defaultValues = useNormalizedFormDefaultValue(
    // @ts-ignore
    formData?.update_request?.content ?? formData?.answers,
    formSteps,
    entity.migrated
  );

  const formTitle = useMemo(() => {
    const reportingWindow = getReportingWindow(
      entity?.due_at,
      entity.framework_key === "ppc" ? "quarterly" : "bi-annually"
    );

    return `${formData.form?.title} ${isReport ? reportingWindow : ""}`;
  }, [entity?.due_at, entity.framework_key, formData.form?.title, getReportingWindow, isReport]);

  if (isError) {
    return notFound();
  }

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
    if (isLoading) return {};

    const stepIndex = formSteps!.findIndex(step => step.fields.find(field => field.feedbackRequired) != null);

    return {
      initialStepIndex: stepIndex < 0 ? undefined : stepIndex,
      disableInitialAutoProgress: stepIndex >= 0
    };
  }, [isLoading]);

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading}>
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
              saveAndCloseModalMapping[entityName] ||
              t(
                "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the reporting tasks section under your project page. Would you like to close this form and continue later?"
              ),
            onConfirm() {
              router.push(getEntityDetailPageLink(entityName, entityUUID));
            }
          }}
          {...initialStepProps}
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default EditEntityPage;
