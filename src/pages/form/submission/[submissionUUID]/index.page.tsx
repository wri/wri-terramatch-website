import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import FrameworkProvider, { useFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { usePatchV2FormsSubmissionsUUID, usePutV2FormsSubmissionsSubmitUUID } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { useFormSubmission } from "@/hooks/useFormGet";
import {
  useGetCustomFormSteps,
  useNormalizedFormDefaultValue
} from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";

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
  //@ts-ignore
  const defaultValues = useNormalizedFormDefaultValue(formData?.data?.answers, formSteps);

  const { openModal, closeModal } = useModalContext();
  const handleSubmit = useCallback(() => {
    openModal(
      ModalId.MODAL_CONFIRM,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Are you ready to submit your application?")}
        content={t(
          `If you are ready to submit your application for review, please confirm by pressing the 
          “Submit” button. You will not be able to edit your application after submission, unless the 
          review team reopens it with a request for more information.<br/>
          If you are not ready to submit your application, press “Cancel” to return to your draft.
          `
        )}
        primaryButtonProps={{
          children: t("Submit"),
          onClick: () => {
            closeModal(ModalId.MODAL_CONFIRM);
            submitFormSubmission({
              pathParams: {
                uuid: submissionUUID
              }
            });
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.MODAL_CONFIRM)
        }}
      />
    );
  }, [closeModal, openModal, submissionUUID, submitFormSubmission, t]);

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
            onSubmit={handleSubmit}
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
            //@ts-ignore
            formSubmissionOrg={formData?.data?.organisation_attributes}
          />
        </FrameworkProvider>
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default SubmissionPage;
