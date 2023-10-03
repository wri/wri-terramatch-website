import { t } from "@transifex/native";
import { useRouter } from "next/router";

import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import {
  useGetV2ProjectPitchesUUID,
  usePatchV2ProjectPitchesUUID,
  usePutV2ProjectPitchesSubmitUUID
} from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { useNormalizedFormDefaultValue } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { getSteps } from "@/pages/organization/[id]/project-pitch/create/[pitchUUID]/getCreatePitchSteps";

const ProjectPitchCreate = () => {
  const router = useRouter();
  const pitchUUID = router.query.pitchUUID as string;

  const { data: pitch, isLoading } = useGetV2ProjectPitchesUUID(
    { pathParams: { uuid: pitchUUID } },
    {
      enabled: !!pitchUUID
    }
  );

  const { mutate: updateProjectPitch, isLoading: isUpdating, isSuccess, error } = usePatchV2ProjectPitchesUUID({});

  const { mutate: submitProjectPitch, isLoading: isSubmitting } = usePutV2ProjectPitchesSubmitUUID({
    onSuccess() {
      router.push(`${router.asPath}/confirm`);
    }
  });

  const formSteps = getSteps(t, pitchUUID);
  //@ts-expect-error
  const defaultValues = useNormalizedFormDefaultValue(pitch?.data, formSteps);

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading}>
        <WizardForm
          steps={formSteps}
          formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
          errors={error}
          defaultValues={defaultValues}
          onChange={data => {
            updateProjectPitch({
              body: normalizedFormData(data, formSteps),
              pathParams: { uuid: pitchUUID }
            });
          }}
          //@ts-expect-error
          onSubmit={() => submitProjectPitch({ pathParams: { uuid: pitchUUID } })}
          submitButtonDisable={isSubmitting}
          summaryOptions={{
            title: t("Review your answers"),
            subtitle: t(
              "Please review the summary of your project targets. If correct, please click 'submit'. If any targets need to be corrected, please click 'back' and make your corrections."
            )
          }}
          onBackFirstStep={router.back}
          tabOptions={{
            markDone: true,
            disableFutureTabs: true
          }}
          title={t("Add new pitch")}
          hideSaveAndCloseButton
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default ProjectPitchCreate;
