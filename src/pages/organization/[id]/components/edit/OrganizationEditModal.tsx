import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EditModalBase } from "@/components/extensive/Modal/ModalsBases";
import ConfirmationModal from "@/components/extensive/WizardForm/modals/ConfirmationModal";
import ErrorModal from "@/components/extensive/WizardForm/modals/ErrorModal";
import WizardEditForm from "@/components/extensive/WizardForm/modals/WizardEditForm";
import { useGadmOptions } from "@/connections/Gadm";
import { updateOrganisation } from "@/connections/Organisation";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";

import { getSteps } from "./getEditOrganisationSteps";

// Support both v2 and v3 DTOs during migration
type OrganizationData = V2OrganisationRead | OrganisationFullDto;

type OrganizationEditModalProps = {
  organization?: OrganizationData;
};

const OrganizationEditModal = ({ organization }: OrganizationEditModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const uuid = router.query.id as string;
  const t = useT();
  const { closeModal, openModal } = useModalContext();
  const countryOptions = useGadmOptions({ level: 0 });

  const formSteps = useMemo(() => getSteps(t, countryOptions ?? []), [countryOptions, t]);
  const provider = useLocalStepsProvider(formSteps);
  const defaultValues = useMemo(() => formDefaultValues(organization ?? {}, provider), [organization, provider]);

  const handleSave = useCallback(
    async (data: any) => {
      try {
        const updatedData = await updateOrganisation(normalizedFormData(data, provider), { id: uuid });
        queryClient.invalidateQueries({ queryKey: ["v2", "organisations"] });
        queryClient.refetchQueries({ queryKey: ["auth", "me"] });

        if (updatedData?.uuid != null) {
          closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
          return openModal(ModalId.CONFIRMATION_MODAL, <ConfirmationModal />);
        } else {
          return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
        }
      } catch (error) {
        return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
      }
    },
    [closeModal, openModal, provider, uuid, queryClient]
  );

  const models = useMemo(() => ({ model: "organisations", uuid } as const), [uuid]);

  return (
    <EditModalBase>
      <WizardEditForm
        title={t("Edit Organization Profile")}
        framework={Framework.UNDEFINED}
        models={models}
        fieldsProvider={provider}
        onSave={handleSave}
        defaultValues={defaultValues}
        errors={undefined}
      />
    </EditModalBase>
  );
};

export default OrganizationEditModal;
