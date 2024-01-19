import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import WizardForm from "@/components/extensive/WizardForm";
import { getRequestedInformationForm } from "@/components/extensive/WizardForm/utils";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import {
  useGetV2ApplicationsUUID,
  usePatchV2FormsSubmissionsUUID,
  usePutV2FormsSubmissionsSubmitUUID
} from "@/generated/apiComponents";
import { ApplicationRead, FormSubmissionRead } from "@/generated/apiSchemas";
import { getCustomFormSteps } from "@/helpers/customForms";
import { useNormalizedFormDefaultValue } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";

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
    }
  });

  const { mutate: updateSubmission, isSuccess, isLoading } = usePatchV2FormsSubmissionsUUID({});

  const { mutate: submitFormSubmission, isLoading: isSubmitting } = usePutV2FormsSubmissionsSubmitUUID({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2", "applications", uuid] });
      router.push(`/applications/request-more-information/success/${uuid}`);
    }
  });

  const submission = applicationData?.data?.current_submission as FormSubmissionRead;

  const requestedInformationForm = getRequestedInformationForm(
    submission?.form ?? {},
    //@ts-ignore
    submission?.feedback_fields ?? []
  );
  const formSteps = submission ? getCustomFormSteps(requestedInformationForm, t) : [];
  const defaultValues = useNormalizedFormDefaultValue(submission?.answers, formSteps);

  return (
    <BackgroundLayout>
      <LoadingContainer loading={applicationLoading}>
        <WizardForm
          disableInitialAutoProgress
          steps={formSteps}
          nextButtonText={t("Save and Continue")}
          submitButtonText={t("Submit")}
          hideBackButton={false}
          onBackFirstStep={router.back}
          onCloseForm={() => router.push(`/applications/${uuid}`)}
          onChange={data => updateSubmission({ pathParams: { uuid: submission?.uuid ?? "" }, body: { answers: data } })}
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
            title: t("Review Application Details")
          }}
          title={submission?.form?.title}
          roundedCorners
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default RequestMoreInformationPage;
