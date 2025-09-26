import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { OrgFormDetails } from "@/components/elements/Inputs/FinancialTableInput/types";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/util/Form";
import { useFramework } from "@/context/framework.provider";
import { FormModel, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { usePatchV2FormsSubmissionsUUID, usePutV2FormsSubmissionsSubmitUUID } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { useFormSubmission } from "@/hooks/useFormGet";
import { useFormDefaultValues } from "@/hooks/useNormalFormValues";

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
  const defaultValues = useFormDefaultValues(formData?.data?.answers ?? {}, formData?.data?.form_uuid);

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
