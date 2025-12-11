import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { Dictionary, last } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useApplication } from "@/connections/Application";
import { useForm } from "@/connections/Form";
import { useSubmission } from "@/connections/FormSubmission";
import { useFramework } from "@/context/framework.provider";
import { FormModel, OrgFormDetails, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2OrganisationsUUID, usePutV2FormsSubmissionsSubmitUUID } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { useSubmissionUpdate } from "@/hooks/useFormUpdate";

//Need to refactor this page, we can just reuse submission page and pass a flag to filter questions! lot's of duplications!
const RequestMoreInformationPage = () => {
  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;
  const queryClient = useQueryClient();

  const [applicationLoaded, { data: application }] = useApplication({ id: uuid, sideloads: ["currentSubmission"] });
  const currentSubmissionUuid = last(application?.submissions)?.uuid;
  const [, { data: submission }] = useSubmission({ id: currentSubmissionUuid, enabled: currentSubmissionUuid != null });

  const { mutate: submitFormSubmission, isLoading: isSubmitting } = usePutV2FormsSubmissionsSubmitUUID({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2", "applications", uuid] });
      router.push(`/applications/request-more-information/success/${uuid}`);
    }
  });

  const { updateSubmission, isSuccess, isUpdating } = useSubmissionUpdate(submission?.uuid ?? "");

  const framework = useFramework(submission?.frameworkKey);

  const formModels = useMemo(() => {
    const models: FormModel[] = [];
    if (submission?.organisationUuid != null) {
      models.push({ model: "organisations", uuid: submission.organisationUuid });
    }
    if (submission?.projectPitchUuid != null) {
      models.push({ model: "projectPitches", uuid: submission.projectPitchUuid });
    }
    return models;
  }, [submission?.organisationUuid, submission?.projectPitchUuid]);
  const feedbackFields = useMemo(
    () => submission?.translatedFeedbackFields ?? [],
    [submission?.translatedFeedbackFields]
  );
  const requestedInformationFilter = useCallback(
    // TODO: this should not be using the label. It will require an API change and a data migration
    //  in the DB to fix this.
    ({ label }: FormQuestionDto) => feedbackFields.includes(label),
    [feedbackFields]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(
    submission?.formUuid,
    feedbackFields,
    requestedInformationFilter
  );
  const defaultValues = useMemo(
    () => formDefaultValues(submission?.answers ?? {}, fieldsProvider),
    [fieldsProvider, submission?.answers]
  );
  const [, { data: form }] = useForm({ id: submission?.formUuid ?? undefined, enabled: submission?.formUuid != null });

  const { data: orgData, isLoading: orgLoading } = useGetV2OrganisationsUUID<{ data: V2OrganisationRead }>(
    { pathParams: { uuid: submission?.organisationUuid ?? "" } },
    { enabled: submission?.organisationUuid != null }
  );

  const orgDetails = useMemo(
    (): OrgFormDetails => ({
      uuid: orgData?.data.uuid,
      currency: orgData?.data.currency ?? undefined,
      startMonth: orgData?.data.fin_start_month ?? undefined
    }),
    [orgData?.data.currency, orgData?.data.fin_start_month, orgData?.data.uuid]
  );

  const onChange = useCallback(
    (data: Dictionary<any>) => {
      updateSubmission({ answers: normalizedFormData(data, fieldsProvider) });
    },
    [fieldsProvider, updateSubmission]
  );

  return (
    <BackgroundLayout>
      <LoadingContainer loading={!applicationLoaded || !providerLoaded || orgLoading}>
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
