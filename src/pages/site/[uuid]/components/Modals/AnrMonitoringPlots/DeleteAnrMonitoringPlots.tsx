import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { WarningIcon } from "@/redesignComponents/foundations/Icons/Function/WarningIcon";

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
      modal={false}
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {t("Delete monitoring plots?")}
        </Text>
      }
      content={
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
          <WarningIcon boxSize={8} color={"warning.500"} mb={2} />
          <Text textStyle="400" color="neutral.900" textAlign="center">
            {t("Are you sure you want to delete")}
          </Text>
          <Text textStyle="500-bold" color="neutral.900" textAlign="center">
            {t("these ANR monitoring plots?")}
          </Text>

          <Text textStyle="400-bold" color="warning.900" mt={2} textAlign="center">
            {t("This action cannot be undone.")}
          </Text>
        </Flex>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              className: "!w-1/2",
              disabled: isDeleting,
              onClick: handleClose
            },
            {
              id: "delete",
              variant: "primary",
              typeVariant: "negative",
              classNameContainer: "!w-1/2",
              className: "!w-full",
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
