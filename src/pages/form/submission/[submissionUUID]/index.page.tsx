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
import { pruneSubmission } from "@/connections/FormSubmission";
import { useFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { FormModel, OrgFormDetails, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2OrganisationsUUID } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { useFormSubmission } from "@/hooks/useFormGet";
import { useSubmissionUpdate } from "@/hooks/useFormUpdate";
import { useOnUnmount } from "@/hooks/useOnMount";

const SubmissionPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const { isLoading, formData, form } = useFormSubmission(submissionUUID);
  const { updateSubmission, submissionUpdating } = useSubmissionUpdate(submissionUUID);

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

  const { data: orgData, isLoading: orgLoading } = useGetV2OrganisationsUUID<{ data: V2OrganisationRead }>(
    { pathParams: { uuid: formData?.organisationUuid ?? "" } },
    { enabled: formData?.organisationUuid != null }
  );
  const orgDetails = useMemo(
    (): OrgFormDetails | undefined =>
      orgData == null
        ? undefined
        : {
            uuid: orgData.data.uuid,
            currency: orgData.data.currency,
            startMonth: orgData.data.fin_start_month
          },
    [orgData]
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

  useOnUnmount(() => {
    if (submissionUUID != null) pruneSubmission(submissionUUID);
  });

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading || orgLoading || !providerLoaded}>
        <WizardForm
          models={formModels}
          framework={framework}
          fieldsProvider={fieldsProvider}
          onBackFirstStep={router.back}
          onCloseForm={() => router.push("/home")}
          onChange={onChange}
          formStatus={submissionUpdating ? "saving" : "saved"}
          onSubmit={handleSubmit}
          submitButtonDisable={!submissionUpdating}
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
