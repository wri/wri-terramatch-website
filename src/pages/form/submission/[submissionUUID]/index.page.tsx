import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useApplication } from "@/connections/Application";
import { useFramework } from "@/context/framework.provider";
import { FormModel, useApiFieldsProvider, useOrgFormDetails } from "@/context/wizardForm.provider";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { useFormSubmission } from "@/hooks/useFormGet";
import { useSubmissionUpdate } from "@/hooks/useFormUpdate";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { WarningIcon } from "@/redesignComponents/foundations/Icons/Function/WarningIcon";

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

  const [orgDetailsLoaded, orgDetails] = useOrgFormDetails(formData?.organisationUuid ?? undefined);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleSubmit = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const onChange = useCallback(
    (data: Dictionary<any>) => {
      updateSubmission({ answers: normalizedFormData(data, fieldsProvider) });
    },
    [fieldsProvider, updateSubmission]
  );

  const [applicationLoaded, { data: application }] = useApplication({ id: submission?.applicationUuid ?? "" });

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading || !orgDetailsLoaded || !providerLoaded || !applicationLoaded}>
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
          entity={application != null && submission != null ? { ...application, status: submission.status } : undefined}
        />
      </LoadingContainer>
      <ModalConfirmation
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title={t("Are you ready to submit your application?")}
        content={
          <Flex flexDirection="column" gap={2} alignItems="center">
            <WarningIcon boxSize={10} color="warning.500" />
            <Text textStyle="400" color="neutral.900" textAlign="center">
              {t(
                'If you are ready to submit your application for review, please confirm by pressing the "Submit" button. You will not be able to edit your application after submission, unless the review team reopens it with a request for more information.\n\nIf you are not ready to submit your application, press "Cancel" to return to your draft.'
              )}
            </Text>
          </Flex>
        }
        buttonsPrimary={[
          {
            children: t("Submit"),
            className: "!w-full",
            onClick: () => {
              setIsConfirmModalOpen(false);
              updateSubmission({ status: "awaiting-approval" });
            }
          }
        ]}
        buttonsCancel={[
          {
            children: t("Cancel"),
            variant: "secondary",
            className: "!w-full",
            onClick: () => setIsConfirmModalOpen(false)
          }
        ]}
      />
    </BackgroundLayout>
  );
};

export default SubmissionPage;
