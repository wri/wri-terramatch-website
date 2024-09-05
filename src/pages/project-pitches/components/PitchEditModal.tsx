import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EditModalBase } from "@/components/extensive/Modal/ModalsBases";
import ConfirmationModal from "@/components/extensive/WizardForm/modals/ConfirmationModal";
import ErrorModal from "@/components/extensive/WizardForm/modals/ErrorModal";
import WizardEditForm from "@/components/extensive/WizardForm/modals/WizardEditForm";
import { useModalContext } from "@/context/modal.provider";
import { usePatchV2ProjectPitchesUUID } from "@/generated/apiComponents";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import { normalizedFormData, normalizedFormDefaultValue } from "@/helpers/customForms";
import { getSteps } from "@/pages/organization/[id]/project-pitch/create/[pitchUUID]/getCreatePitchSteps";

type PitchEditModalProps = {
  pitch: ProjectPitchRead;
};

const PitchEditModal = ({ pitch }: PitchEditModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const uuid = router.query.id as string;
  const t = useT();
  const { closeModal, openModal } = useModalContext();

  const { mutateAsync: updatePitch, error } = usePatchV2ProjectPitchesUUID({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["v2", "project-pitches"] })
  });

  const handleSave = async (data: any) => {
    const res = await updatePitch({
      body: normalizedFormData(data, formSteps),
      pathParams: { uuid }
    });

    if (res) {
      closeModal(ModalId.PITCH_EDIT_MODAL);
      return openModal(ModalId.CONFIRMATION_MODAL, <ConfirmationModal />);
    } else {
      return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
    }
  };

  const formSteps = getSteps(t, uuid ?? "");
  const defaultValues = normalizedFormDefaultValue(pitch, formSteps);

  return (
    <EditModalBase>
      <WizardEditForm
        title={t("Edit Pitch")}
        errors={error}
        onSave={handleSave}
        steps={formSteps}
        defaultValues={defaultValues}
      />
    </EditModalBase>
  );
};

export default PitchEditModal;
