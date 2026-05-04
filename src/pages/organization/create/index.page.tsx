import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGadmOptions } from "@/connections/Gadm";
import { deleteOrganisation, updateOrganisation, useMyOrg, useOrganisation } from "@/connections/Organisation";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { OrganisationUpdateAttributes } from "@/generated/v3/userService/userServiceSchemas";
import { formDefaultValues } from "@/helpers/customForms";
import Log from "@/utils/log";

import { getSteps } from "./getCreateOrganisationSteps";

const CreateOrganisationForm = () => {
  const t = useT();
  const router = useRouter();
  const [, { organisationId }] = useMyOrg();
  const { openModal, closeModal } = useModalContext();
  const queryClient = useQueryClient();
  const countryOptions = useGadmOptions({ level: 0 });

  const uuid = (organisationId || router?.query?.uuid) as string;

  const [orgLoaded, { data: orgData, update, isUpdating: isLoading, updateFailure }] = useOrganisation(
    uuid != null ? { id: uuid } : {}
  );

  const isSuccess = useMemo(() => {
    if (updateFailure != null) return false;
    if (isLoading) return false;
    return orgData != null;
  }, [updateFailure, isLoading, orgData]);

  const handleSubmit = useCallback(async () => {
    if (uuid == null) return;
    try {
      await updateOrganisation({ status: "pending" }, { id: uuid });
      router.push("/organization/create/confirm");
    } catch (error) {
      Log.error("Failed to submit organization:", error);
    }
  }, [uuid, router]);

  const handleDeleteDraft = useCallback(async () => {
    if (uuid == null) return;
    try {
      await deleteOrganisation(uuid);
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] });
      router.push("/assign");
      closeModal(ModalId.WARNING);
    } catch (error) {
      Log.error("Failed to delete draft organization:", error);
    }
  }, [uuid, queryClient, router, closeModal]);

  const formSteps = useMemo(() => getSteps(t, countryOptions ?? []), [countryOptions, t]);
  const provider = useLocalStepsProvider(formSteps);
  const defaultValues = useMemo(() => formDefaultValues(orgData ?? {}, provider), [orgData, provider]);

  const onBackFirstStep = () => {
    openModal(
      ModalId.WARNING,
      <Modal
        title={t("Warning")}
        content={t("Leaving this page will cause you to lose your progress. Are you sure?")}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: handleDeleteDraft
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: () => closeModal(ModalId.WARNING)
        }}
      />
    );
  };

  const models = useMemo(() => ({ model: "organisations", uuid } as const), [uuid]);

  const onChange = useCallback(
    (data: Dictionary<unknown>) => {
      if (update == null || uuid == null) return;
      const attributes = data as unknown as OrganisationUpdateAttributes;
      update(attributes);
    },
    [update, uuid]
  );

  return (
    <BackgroundLayout>
      <LoadingContainer loading={!orgLoaded && uuid != null}>
        <WizardForm
          framework={Framework.UNDEFINED}
          models={models}
          fieldsProvider={provider}
          formStatus={isSuccess ? "saved" : isLoading ? "saving" : undefined}
          defaultValues={defaultValues}
          onChange={onChange}
          onSubmit={handleSubmit}
          submitButtonDisable={isLoading}
          onBackFirstStep={onBackFirstStep}
          title={t("Create Organization")}
          hideSaveAndCloseButton
          roundedCorners
          entity={orgData ?? undefined}
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default CreateOrganisationForm;
