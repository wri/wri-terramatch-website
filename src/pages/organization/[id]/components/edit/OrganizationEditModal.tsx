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

  const saveOrganisation = useCallback(
    async (data: Dictionary<unknown>, showSuccessModal: boolean) => {
      if (uuid == null) return;

      try {
        await updateEntityFormData(
          { answers: normalizedFormData(data, fieldsProvider) },
          { entity: "organisations", uuid }
        );
        if (!showSuccessModal) return;
        closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
        openModal(ModalId.CONFIRMATION_MODAL, <ConfirmationModal />);
      } catch (error) {
        Log.error("Failed to save organisation form data", error);
        openModal(ModalId.ERROR_MODAL, <ErrorModal />);
      }
    },
    [closeModal, fieldsProvider, openModal, uuid]
  );

  const handleStepSave = useCallback((data: Dictionary<unknown>) => saveOrganisation(data, false), [saveOrganisation]);
  const handleSubmit = useCallback((data: Dictionary<unknown>) => saveOrganisation(data, true), [saveOrganisation]);

  return (
    <EditModalBase>
      <LoadingContainer loading={!isReady}>
        <WizardEditForm
          title={t("Edit Organization Profile")}
          framework={Framework.UNDEFINED}
          models={models}
          fieldsProvider={fieldsProvider}
          onStepSave={handleStepSave}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
        />
      </LoadingContainer>
    </EditModalBase>
  );
};

export default OrganizationEditModal;
