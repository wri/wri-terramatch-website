import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { EditModalBase } from "@/components/extensive/Modal/ModalsBases";
import ConfirmationModal from "@/components/extensive/WizardForm/modals/ConfirmationModal";
import ErrorModal from "@/components/extensive/WizardForm/modals/ErrorModal";
import WizardEditForm from "@/components/extensive/WizardForm/modals/WizardEditForm";
import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { useModalContext } from "@/context/modal.provider";
import { usePutV2OrganisationsUUID } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { normalizedFormData } from "@/helpers/customForms";
import { useNormalizedFormDefaultValue } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";

import { getSteps } from "./getEditOrganisationSteps";

type OrganizationEditModalProps = {
  organization?: V2OrganisationRead;
};

const OrganizationEditModal = ({ organization }: OrganizationEditModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const uuid = router.query.id as string;
  const t = useT();
  const { setModalContent } = useModalContext();

  const defaultValues = useNormalizedFormDefaultValue(organization, getSteps(t, uuid));
  const formSteps = getSteps(t, uuid);
  const { mutateAsync: updateOrganization, error } = usePutV2OrganisationsUUID({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2", "organisations"] });
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });
    }
  });

  const handleSave = async (data: any, step: FormStepSchema) => {
    // @ts-ignore
    const res: { data: V2OrganisationRead } = await updateOrganization({
      body: normalizedFormData(data, formSteps),
      pathParams: { uuid }
    });

    if (res.data.uuid) return setModalContent(<ConfirmationModal />);
    return setModalContent(<ErrorModal />);
  };

  return (
    <EditModalBase>
      <WizardEditForm
        title={t("Edit Organization Profile")}
        onSave={handleSave}
        steps={formSteps}
        defaultValues={defaultValues}
        errors={error}
      />
    </EditModalBase>
  );
};

export default OrganizationEditModal;
