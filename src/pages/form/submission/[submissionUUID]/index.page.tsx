import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import FrameworkProvider, { useFramework } from "@/context/framework.provider";
import { usePatchV2FormsSubmissionsUUID, usePutV2FormsSubmissionsSubmitUUID } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { useFormSubmission } from "@/hooks/useFormGet";
import { useFormDefaultValues, useGetCustomFormSteps } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";

const SubmissionPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const { isLoading, formData } = useFormSubmission(submissionUUID);

  const { mutate: updateSubmission, isSuccess, isLoading: isUpdating, error } = usePatchV2FormsSubmissionsUUID({});

  const { mutate: submitFormSubmission, isLoading: isSubmitting } = usePutV2FormsSubmissionsSubmitUUID({
    onSuccess() {
      router.push(`/form/submission/${submissionUUID}/confirm`);
    }
  });

  const framework = useFramework(formData?.data?.form?.framework_key);
  const formSteps = useGetCustomFormSteps(
    formData?.data?.form,
    { entityName: "project-pitch", entityUUID: formData?.data?.project_pitch_uuid ?? "" },
    framework
  );
  const defaultValues = useFormDefaultValues(formData?.data?.answers, formSteps);

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading}>
        <FrameworkProvider frameworkKey={framework}>
          <WizardForm
            steps={formSteps!}
            errors={error}
            onBackFirstStep={router.back}
            onCloseForm={() => router.push("/home")}
            onChange={data =>
              updateSubmission({
                pathParams: { uuid: submissionUUID },
                body: { answers: normalizedFormData(data, formSteps!) }
              })
            }
            formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
            onSubmit={() =>
              submitFormSubmission({
                pathParams: {
                  uuid: submissionUUID
                }
              })
            }
            submitButtonDisable={isSubmitting}
            defaultValues={defaultValues}
            title={formData?.data.form?.title}
            tabOptions={{
              markDone: true,
              disableFutureTabs: true
            }}
            summaryOptions={{
              title: t("Review Application Details"),
              downloadButtonText: t("Download Application")
            }}
            roundedCorners
            formSubmissionOrg={formData?.data?.organisation_attributes}
          />
        </FrameworkProvider>
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default SubmissionPage;
