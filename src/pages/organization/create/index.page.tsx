import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { useCallback } from "react";

import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { deleteOrganisation, updateOrganisation, useMyOrg, useOrganisation } from "@/connections/Organisation";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { normalizedFormData } from "@/helpers/customForms";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useOrganisationForm } from "@/hooks/useOrganisationForm";
import Log from "@/utils/log";

const CreateOrganisationForm = () => {
  const t = useT();
  const router = useRouter();
  const [, { organisationId }] = useMyOrg();
  const { openModal, closeModal } = useModalContext();

  const uuid = (organisationId || router?.query?.uuid) as string;

  const [orgLoaded, { data: orgData }] = useOrganisation(uuid != null ? { id: uuid } : {});
  const { models, fieldsProvider, defaultValues, isReady } = useOrganisationForm(uuid);
  const { updateEntityAnswers, entityAnswersUpdating } = useFormUpdate("organisations", uuid);

  const handleSubmit = useCallback(async () => {
    if (uuid == null) return;
    try {
      await updateOrganisation({ status: "pending-approval" }, { id: uuid });
      router.push("/organization/create/confirm");
    } catch (error) {
      Log.error("Failed to submit organization:", error);
    }
  }, [uuid, router]);

  const handleDeleteDraft = useCallback(async () => {
    if (uuid == null) return;
    try {
      await deleteOrganisation(uuid);
      router.push("/assign");
      closeModal(ModalId.WARNING);
    } catch (error) {
      Log.error("Failed to delete draft organization:", error);
    }
  }, [uuid, router, closeModal]);

  const onBackFirstStep = (shouldHideWarning?: boolean) => {
    if (shouldHideWarning) {
      handleDeleteDraft();
      return;
    }
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

  const onChange = useCallback(
    (data: Dictionary<unknown>) => updateEntityAnswers({ answers: normalizedFormData(data, fieldsProvider) }),
    [fieldsProvider, updateEntityAnswers]
  );

  return (
    <BackgroundLayout>
      <LoadingContainer loading={uuid != null && (!orgLoaded || !isReady)}>
        <WizardForm
          framework={Framework.UNDEFINED}
          models={models}
          fieldsProvider={fieldsProvider}
          formStatus={entityAnswersUpdating ? "saving" : "saved"}
          defaultValues={defaultValues}
          onChange={onChange}
          onSubmit={handleSubmit}
          submitButtonDisable={entityAnswersUpdating}
          onBackFirstStep={onBackFirstStep}
          title={t("Create Organization")}
          hideSaveAndCloseButton
          stepNavigationFooter
          roundedCorners
          entity={orgData ?? undefined}
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default CreateOrganisationForm;
