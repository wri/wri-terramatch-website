import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/util/Form";
import { useFramework } from "@/context/framework.provider";
import { FormModel, OrgFormDetails, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2ApplicationsUUID, usePutV2FormsSubmissionsSubmitUUID } from "@/generated/apiComponents";
import { ApplicationRead } from "@/generated/apiSchemas";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { useSubmissionUpdate } from "@/hooks/useFormUpdate";

//Need to refactor this page, we can just reuse submission page and pass a flag to filter questions! lot's of duplications!
const RequestMoreInformationPage = () => {
  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;
  const queryClient = useQueryClient();

  const { data: applicationData, isLoading: applicationLoading } = useGetV2ApplicationsUUID<{
    data: ApplicationRead;
  }>({
    pathParams: {
      uuid
    },
    queryParams: { lang: router.locale }
  });

  const { mutate: submitFormSubmission, isLoading: isSubmitting } = usePutV2FormsSubmissionsSubmitUUID({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2", "applications", uuid] });
      router.push(`/applications/request-more-information/success/${uuid}`);
    }
  });

  const submission = (applicationData?.data?.form_submissions ?? []).find(
    ({ uuid }) => uuid === applicationData?.data?.current_submission_uuid
  );

  const { updateSubmission, isSuccess, isUpdating } = useSubmissionUpdate(submission?.uuid ?? "");

  const framework = useFramework(submission?.framework_key);

  const formModels = useMemo(() => {
    const models: FormModel[] = [];
    if (submission?.organisation_uuid != null) {
      models.push({ model: "organisations", uuid: submission.organisation_uuid });
    }
    if (submission?.project_pitch_uuid != null) {
      models.push({ model: "projectPitches", uuid: submission.project_pitch_uuid });
    }
    return models;
  }, [submission?.organisation_uuid, submission?.project_pitch_uuid]);
  const feedbackFields = useMemo(
    () => submission?.translated_feedback_fields ?? [],
    [submission?.translated_feedback_fields]
  );
  const requestedInformationFilter = useCallback(
    // TODO: this should not be using the label. It will require an API change and a data migration
    //  in the DB to fix this.
    ({ label }: FormQuestionDto) => feedbackFields.includes(label),
    [feedbackFields]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(
    submission?.form_uuid,
    feedbackFields,
    requestedInformationFilter
  );
  const defaultValues = useMemo(
    () => formDefaultValues(submission?.answers ?? {}, fieldsProvider),
    [fieldsProvider, submission?.answers]
  );
  const [, { data: form }] = useForm({ id: submission?.form_uuid, enabled: submission?.form_uuid != null });

  const orgDetails = useMemo(
    (): OrgFormDetails | undefined =>
      submission?.organisation_attributes == null
        ? undefined
        : {
            uuid: submission.organisation_attributes.uuid,
            currency: submission.organisation_attributes.currency,
            startMonth: submission.organisation_attributes.start_month
          },
    [submission?.organisation_attributes]
  );

  const onChange = useCallback(
    (data: Dictionary<any>) => {
      updateSubmission({ answers: normalizedFormData(data, fieldsProvider) });
    },
    [fieldsProvider, updateSubmission]
  );

  return (
    <BackgroundLayout>
      <LoadingContainer loading={applicationLoading || !providerLoaded}>
        <WizardForm
          fieldsProvider={fieldsProvider}
          models={formModels}
          framework={framework}
          disableInitialAutoProgress
          nextButtonText={t("Save and Continue")}
          submitButtonText={t("Submit")}
          hideBackButton={false}
          onBackFirstStep={router.back}
          onCloseForm={() => router.push(`/applications/${uuid}`)}
          onChange={onChange}
          formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
          onSubmit={() =>
            submitFormSubmission({
              pathParams: {
                uuid: submission?.uuid ?? ""
              }
            })
          }
          submitButtonDisable={isSubmitting}
          defaultValues={defaultValues}
          tabOptions={{
            markDone: true,
            disableFutureTabs: true
          }}
          summaryOptions={{
            title: t("Review Application Details"),
            downloadButtonText: t("Download Application")
          }}
          title={form?.title}
          roundedCorners
          orgDetails={orgDetails}
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default RequestMoreInformationPage;
