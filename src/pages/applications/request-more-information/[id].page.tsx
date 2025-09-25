import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import WizardForm from "@/components/extensive/WizardForm";
import { getRequestedInformationForm } from "@/components/extensive/WizardForm/utils";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import FormModelProvider, { FormModel } from "@/context/formModel.provider";
import FrameworkProvider, { useFramework } from "@/context/framework.provider";
import {
  useGetV2ApplicationsUUID,
  usePatchV2FormsSubmissionsUUID,
  usePutV2FormsSubmissionsSubmitUUID
} from "@/generated/apiComponents";
import { ApplicationRead } from "@/generated/apiSchemas";
import { getCustomFormSteps } from "@/helpers/customForms";
import { useFormDefaultValues } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { Entity } from "@/types/common";

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

  const { mutate: updateSubmission, isSuccess, isLoading } = usePatchV2FormsSubmissionsUUID({});

  const { mutate: submitFormSubmission, isLoading: isSubmitting } = usePutV2FormsSubmissionsSubmitUUID({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2", "applications", uuid] });
      router.push(`/applications/request-more-information/success/${uuid}`);
    }
  });

  const submission = (applicationData?.data?.form_submissions ?? []).find(
    ({ uuid }) => uuid === applicationData?.data?.current_submission_uuid
  );

  // Create entity object for RHFMap to work with useGetV2TerrafundProjectPolygon
  const currentPitchEntity: Entity = {
    entityName: "project-pitch",
    entityUUID: submission?.project_pitch_uuid ?? ""
  };

  const requestedInformationForm = getRequestedInformationForm(
    submission?.form ?? {},
    //@ts-ignore
    submission?.translated_feedback_fields ?? []
  );
  const framework = useFramework(submission?.form?.framework_key);
  const formSteps = submission ? getCustomFormSteps(requestedInformationForm, t, currentPitchEntity, framework) : [];
  const defaultValues = useFormDefaultValues(submission?.answers, formSteps);

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

  return (
    <BackgroundLayout>
      <LoadingContainer loading={applicationLoading}>
        <FrameworkProvider frameworkKey={framework}>
          <FormModelProvider models={formModels}>
            <WizardForm
              disableInitialAutoProgress
              steps={formSteps}
              nextButtonText={t("Save and Continue")}
              submitButtonText={t("Submit")}
              hideBackButton={false}
              onBackFirstStep={router.back}
              onCloseForm={() => router.push(`/applications/${uuid}`)}
              onChange={data =>
                updateSubmission({ pathParams: { uuid: submission?.uuid ?? "" }, body: { answers: data } })
              }
              formStatus={isSuccess ? "saved" : isLoading ? "saving" : undefined}
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
              title={submission?.form?.title}
              roundedCorners
              //@ts-ignore
              formSubmissionOrg={submission?.organisation_attributes}
            />
          </FormModelProvider>
        </FrameworkProvider>
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default RequestMoreInformationPage;
