import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { OrgFormDetails } from "@/components/elements/Inputs/FinancialTableInput/types";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/util/Form";
import { useFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { FormModel, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { usePatchV2FormsSubmissionsUUID, usePutV2FormsSubmissionsSubmitUUID } from "@/generated/apiComponents";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { useFormSubmission } from "@/hooks/useFormGet";

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

  const framework = useFramework(formData?.data?.framework_key);

  const formModels = useMemo(() => {
    const models: FormModel[] = [];
    if (formData?.data?.organisation_uuid != null) {
      models.push({ model: "organisations", uuid: formData.data.organisation_uuid });
    }
    if (formData?.data?.project_pitch_uuid != null) {
      models.push({ model: "projectPitches", uuid: formData.data.project_pitch_uuid });
    }
    return models;
  }, [formData?.data.organisation_uuid, formData?.data.project_pitch_uuid]);
  const [, { data: form }] = useForm({ id: formData?.data.form_uuid, enabled: formData?.data.form_uuid != null });
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.data.form_uuid);
  const defaultValues = useMemo(
    () => formDefaultValues(formData?.data?.answers ?? {}, fieldsProvider),
    [fieldsProvider, formData?.data?.answers]
  );

  const orgDetails = useMemo(
    (): OrgFormDetails | undefined =>
      formData?.data?.organisation_attributes == null
        ? undefined
        : {
            uuid: formData?.data?.organisation_attributes.uuid,
            currency: formData?.data?.organisation_attributes.currency,
            startMonth: formData?.data?.organisation_attributes.start_month
          },
    [formData?.data?.organisation_attributes]
  );

  const { openModal, closeModal } = useModalContext();
  const handleSubmit = useCallback(() => {
    openModal(
      ModalId.MODAL_CONFIRM,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Are you ready to submit your application?")}
        content={t(
          "If you are ready to submit your application for review, please confirm by pressing the “Submit” button. You will not be able to edit your application after submission, unless the review team reopens it with a request for more information.\n\nIf you are not ready to submit your application, press “Cancel” to return to your draft."
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
      <LoadingContainer loading={isLoading || !providerLoaded}>
        <WizardForm
          models={formModels}
          framework={framework}
          fieldsProvider={fieldsProvider}
          errors={error}
          onBackFirstStep={router.back}
          onCloseForm={() => router.push("/home")}
          onChange={data =>
            updateSubmission({
              pathParams: { uuid: submissionUUID },
              body: { answers: normalizedFormData(data, fieldsProvider) }
            })
          }
          formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
          onSubmit={handleSubmit}
          submitButtonDisable={isSubmitting}
          defaultValues={defaultValues}
          title={form?.title}
          tabOptions={{
            markDone: true,
            disableFutureTabs: true
          }}
          summaryOptions={{
            title: t("Review Application Details"),
            downloadButtonText: t("Download Application")
          }}
          roundedCorners
          orgDetails={orgDetails}
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default SubmissionPage;
