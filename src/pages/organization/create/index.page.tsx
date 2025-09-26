import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGadmOptions } from "@/connections/Gadm";
import { useMyOrg } from "@/connections/Organisation";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import {
  useDeleteV2OrganisationsRetractMyDraft,
  useGetV2OrganisationsUUID,
  usePutV2OrganisationsSubmitUUID,
  usePutV2OrganisationsUUID
} from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { useFormDefaultValues } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";

import { getSteps } from "./getCreateOrganisationSteps";

const CreateOrganisationForm = () => {
  const t = useT();
  const router = useRouter();
  const [, { organisationId }] = useMyOrg();
  const { openModal, closeModal } = useModalContext();
  const queryClient = useQueryClient();
  const countryOptions = useGadmOptions({ level: 0 });

  const uuid = (organisationId || router?.query?.uuid) as string;

  const { mutate: updateOrganisation, isLoading, isSuccess } = usePutV2OrganisationsUUID({});

  const { data: orgData, isLoading: isFetchingOrgData } = useGetV2OrganisationsUUID<{ data: V2OrganisationRead }>(
    { pathParams: { uuid } },
    {
      enabled: !!uuid
    }
  );

  const {
    mutate: submitOrganisation,
    isLoading: isSubmitting,
    error
  } = usePutV2OrganisationsSubmitUUID({
    onSuccess() {
      router.push("/organization/create/confirm");
    }
  });

  const { mutate: deleteDraft } = useDeleteV2OrganisationsRetractMyDraft({
    async onSuccess() {
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] });
      router.push("/assign");
      closeModal(ModalId.WARNING);
    }
  });

  const formSteps = useMemo(() => getSteps(t, countryOptions ?? []), [countryOptions, t]);
  const provider = useLocalStepsProvider(formSteps);
  const defaultValues = useFormDefaultValues(orgData?.data, formSteps);

  const onBackFirstStep = () => {
    openModal(
      ModalId.WARNING,
      <Modal
        title={t("Warning")}
        content={t("Leaving this page will cause you to lose your progress. Are you sure?")}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: () => deleteDraft({})
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: () => closeModal(ModalId.WARNING)
        }}
      />
    );
  };

  const models = useMemo(() => ({ model: "organisations", uuid } as const), [uuid]);

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isFetchingOrgData}>
        <WizardForm
          framework={Framework.UNDEFINED}
          models={models}
          fieldsProvider={provider}
          formStatus={isSuccess ? "saved" : isLoading ? "saving" : undefined}
          errors={error}
          defaultValues={defaultValues}
          onChange={data => updateOrganisation({ body: data, pathParams: { uuid } })}
          onSubmit={() => submitOrganisation({ pathParams: { uuid } })}
          submitButtonDisable={isSubmitting}
          onBackFirstStep={onBackFirstStep}
          title={t("Create Organization")}
          tabOptions={{
            markDone: true,
            disableFutureTabs: true
          }}
          hideSaveAndCloseButton
          roundedCorners
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default CreateOrganisationForm;
