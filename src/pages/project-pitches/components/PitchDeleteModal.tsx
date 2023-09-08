import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";

import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { useDeleteV2ProjectPitchesUUID } from "@/generated/apiComponents";

type PitchDeleteModalProps = {
  pitchId: string;
  onDelete: () => void;
};

const PitchDeleteModal = ({ pitchId, onDelete }: PitchDeleteModalProps) => {
  const queryClient = useQueryClient();
  const { closeModal } = useModalContext();
  const t = useT();

  // Mutations
  const { mutateAsync: deletePitch } = useDeleteV2ProjectPitchesUUID({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2", "project-pitches"] });
      closeModal();
      return onDelete();
    }
  });

  return (
    <Modal
      title={t("Delete Project Pitch")}
      content={t("Are you sure you want to delete this project pitch?")}
      primaryButtonProps={{
        children: t("Confirm"),
        onClick: () => deletePitch({ pathParams: { uuid: pitchId } })
      }}
      secondaryButtonProps={{
        children: t("Cancel"),
        onClick: () => closeModal()
      }}
    />
  );
};

export default PitchDeleteModal;
