import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

type DeleteAnrMonitoringPlotsProps = {
  isDeleting?: boolean;
  onDelete: () => Promise<boolean>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const DeleteAnrMonitoringPlots: FC<DeleteAnrMonitoringPlotsProps> = ({
  isDeleting = false,
  onDelete,
  onOpenChange,
  open
}) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleDelete = useCallback(async () => {
    const isDeleted = await onDelete();
    if (isDeleted) {
      onOpenChange(false);
    }
  }, [onDelete, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{t("Delete monitoring plots?")}</b>}
      content={
        <Text px={4}>
          {t("Are you sure you want to delete these ANR monitoring plots? This action cannot be undone.")}
        </Text>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              disabled: isDeleting,
              onClick: handleClose
            },
            {
              id: "delete",
              variant: "primary",
              typeVariant: "negative",
              children: isDeleting ? t("Deleting...") : t("Delete"),
              loading: isDeleting,
              disabled: isDeleting,
              onClick: () => void handleDelete()
            }
          ]}
        />
      }
    />
  );
};

export default DeleteAnrMonitoringPlots;
