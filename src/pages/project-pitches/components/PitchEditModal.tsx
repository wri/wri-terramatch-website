import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";

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
  const { setModalContent } = useModalContext();

  const { mutateAsync: updatePitch, error } = usePatchV2ProjectPitchesUUID({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["v2", "project-pitches"] })
  });

  const handleSave = async (data: any) => {
    const res = await updatePitch({
      body: normalizedFormData(data, formSteps),
      pathParams: { uuid }
    });

    if (res) return setModalContent(<ConfirmationModal />);
    return setModalContent(<ErrorModal />);
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
