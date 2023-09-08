import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import {
  useGetV2FormsSubmissionsUUID,
  usePatchV2FormsSubmissionsUUID,
  usePutV2FormsSubmissionsSubmitUUID
} from "@/generated/apiComponents";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { normalizedFormData } from "@/helpers/customForms";
import {
  useGetCustomFormSteps,
  useNormalizedFormDefaultValue
} from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";

const SubmissionPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const { data: formData, isLoading } = useGetV2FormsSubmissionsUUID<{ data: FormSubmissionRead }>(
    { pathParams: { uuid: submissionUUID }, queryParams: { lang: router.locale } },
    {
      enabled: !!submissionUUID
    }
  );

  const { mutate: updateSubmission, isSuccess, isLoading: isUpdating, error } = usePatchV2FormsSubmissionsUUID({});

  const { mutate: submitFormSubmission, isLoading: isSubmitting } = usePutV2FormsSubmissionsSubmitUUID({
    onSuccess() {
      router.push(`/form/submission/${submissionUUID}/confirm`);
    }
  });

  const formSteps = useGetCustomFormSteps(formData?.data?.form);
  //@ts-ignore
  const defaultValues = useNormalizedFormDefaultValue(formData?.data?.answers, formSteps);

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading}>
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
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default SubmissionPage;
