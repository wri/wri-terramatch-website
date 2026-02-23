import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useApplication } from "@/connections/Application";
import { useFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { FormModel, useApiFieldsProvider, useV2OrgFormDetails } from "@/context/wizardForm.provider";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { useFormSubmission } from "@/hooks/useFormGet";
import { useSubmissionUpdate } from "@/hooks/useFormUpdate";

const SubmissionPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const { isLoading, formData, form } = useFormSubmission(submissionUUID);
  const { submission, updateSubmission, submissionUpdating, submissionUpdateFailure } =
    useSubmissionUpdate(submissionUUID);
  useRequestSuccess(
    submissionUpdating,
    submissionUpdateFailure,
    useCallback(() => {
      if (submission?.status === "awaiting-approval") {
        router.push(`/applications/request-more-information/success/${submission?.applicationUuid}?isSendRequest=true`);
      }
    }, [router, submission?.applicationUuid, submission?.status])
  );

  const framework = useFramework(formData?.frameworkKey);

  const formModels = useMemo(() => {
    const models: FormModel[] = [];
    if (formData?.organisationUuid != null) {
      models.push({ model: "organisations", uuid: formData.organisationUuid });
    }
    if (formData?.projectPitchUuid != null) {
      models.push({ model: "projectPitches", uuid: formData.projectPitchUuid });
    }
    return models;
  }, [formData?.organisationUuid, formData?.projectPitchUuid]);
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.formUuid);
  const defaultValues = useMemo(
    () => formDefaultValues(formData?.answers ?? {}, fieldsProvider),
    [fieldsProvider, formData?.answers]
  );

  const [orgDetailsLoaded, orgDetails] = useV2OrgFormDetails(formData?.organisationUuid ?? undefined);

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
            updateSubmission({ status: "awaiting-approval" });
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.MODAL_CONFIRM)
        }}
      />
    );
  }, [closeModal, openModal, t, updateSubmission]);

  const onChange = useCallback(
    (data: Dictionary<any>) => {
      updateSubmission({ answers: normalizedFormData(data, fieldsProvider) });
    },
    [fieldsProvider, updateSubmission]
  );

  const [applicationLoaded, { data: application }] = useApplication({ id: submission?.applicationUuid ?? "" });

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading || !orgDetailsLoaded || !providerLoaded}>
        <WizardForm
          models={formModels}
          framework={framework}
          fieldsProvider={fieldsProvider}
          onBackFirstStep={router.back}
          onCloseForm={() => router.push("/home")}
          onChange={onChange}
          formStatus={submissionUpdating ? "saving" : "saved"}
          onSubmit={handleSubmit}
          submitButtonDisable={submissionUpdating}
          defaultValues={defaultValues}
          title={form?.title}
          summaryOptions={{
            title: t("Review Application Details"),
            downloadButtonText: t("Download Application")
          }}
          roundedCorners
          orgDetails={orgDetails}
          redirectEntityPage={`/applications/${submission?.applicationUuid}`}
          entity={application && submission && { ...application, status: submission.status }}
          entityLoading={applicationLoaded}
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default SubmissionPage;
