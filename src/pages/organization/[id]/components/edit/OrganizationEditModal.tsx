import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EditModalBase } from "@/components/extensive/Modal/ModalsBases";
import ConfirmationModal from "@/components/extensive/WizardForm/modals/ConfirmationModal";
import ErrorModal from "@/components/extensive/WizardForm/modals/ErrorModal";
import WizardEditForm from "@/components/extensive/WizardForm/modals/WizardEditForm";
import { useGadmOptions } from "@/connections/Gadm";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { usePutV2OrganisationsUUID } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { normalizedFormData } from "@/helpers/customForms";
import { useFormDefaultValues } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";

import { getSteps } from "./getEditOrganisationSteps";

type OrganizationEditModalProps = {
  organization?: V2OrganisationRead;
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

  const defaultValues = useFormDefaultValues(organization, formSteps);
  const { mutateAsync: updateOrganization, error } = usePutV2OrganisationsUUID({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2", "organisations"] });
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });
    }
  });

  const handleSave = async (data: any) => {
    // @ts-ignore
    const res: { data: V2OrganisationRead } = await updateOrganization({
      body: normalizedFormData(data, formSteps),
      pathParams: { uuid }
    });

    if (res.data.uuid) {
      closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
      return openModal(ModalId.CONFIRMATION_MODAL, <ConfirmationModal />);
    } else {
      return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
    }
  };

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
        errors={error}
      />
    </EditModalBase>
  );
};

export default OrganizationEditModal;
