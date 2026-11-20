import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EditModalBase } from "@/components/extensive/Modal/ModalsBases";
import ConfirmationModal from "@/components/extensive/WizardForm/modals/ConfirmationModal";
import ErrorModal from "@/components/extensive/WizardForm/modals/ErrorModal";
import WizardEditForm from "@/components/extensive/WizardForm/modals/WizardEditForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { updateEntityFormData } from "@/connections/Form";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import { normalizedFormData } from "@/helpers/customForms";
import { useOrganisationForm } from "@/hooks/useOrganisationForm";
import Log from "@/utils/log";

type OrganizationEditModalProps = {
  organization?: OrganisationFullDto;
};

const OrganizationEditModal = ({ organization }: OrganizationEditModalProps) => {
  const uuid = organization?.uuid;
  const t = useT();
  const { closeModal, openModal } = useModalContext();
  const { models, fieldsProvider, defaultValues, isReady } = useOrganisationForm(uuid);

  /** Returns true if the save succeeded. */
  const saveOrganisation = useCallback(
    async (data: Dictionary<unknown>) => {
      if (uuid == null) return false;

      try {
        await updateEntityFormData(
          { answers: normalizedFormData(data, fieldsProvider) },
          { entity: "organisations", uuid }
        );
        return true;
      } catch (error) {
        Log.error("Failed to save organisation form data", error);
        openModal(ModalId.ERROR_MODAL, <ErrorModal />);
        return false;
      }
    },
    [fieldsProvider, openModal, uuid]
  );

  const handleSubmit = useCallback(
    async (data: Dictionary<unknown>) => {
      if (!(await saveOrganisation(data))) return;
      closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
      openModal(ModalId.CONFIRMATION_MODAL, <ConfirmationModal />);
    },
    [closeModal, openModal, saveOrganisation]
  );

  const handleSaveAndExit = useCallback(
    async (data: Dictionary<unknown>) => {
      if (await saveOrganisation(data)) closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
    },
    [closeModal, saveOrganisation]
  );

  return (
    <EditModalBase>
      <LoadingContainer loading={!isReady}>
        <WizardEditForm
          title={t("Edit Organization Profile")}
          framework={Framework.UNDEFINED}
          models={models}
          fieldsProvider={fieldsProvider}
          onStepSave={saveOrganisation}
          onSubmit={handleSubmit}
          onSaveAndExit={handleSaveAndExit}
          defaultValues={defaultValues}
        />
      </LoadingContainer>
    </EditModalBase>
  );
};

export default OrganizationEditModal;
