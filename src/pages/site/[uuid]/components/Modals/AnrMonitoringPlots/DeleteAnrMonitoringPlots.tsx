import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
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

  const handleDelete = useCallback(async () => {
    const isDeleted = await onDelete();
    if (isDeleted) {
      onOpenChange(false);
    }
  }, [onDelete, onOpenChange]);

  return (
    <ModalConfirmation
      modal={false}
      open={open}
      onOpenChange={onOpenChange}
      size="medium"
      title={t("Delete monitoring plots?")}
      contentLayout="custom"
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
      confirmButton={{
        id: "delete",
        variant: "negative",
        classNameContainer: "!w-1/2",
        className: "!w-full",
        children: isDeleting ? t("Deleting...") : t("Delete"),
        loading: isDeleting,
        disabled: isDeleting,
        onClick: () => void handleDelete()
      }}
      cancelButton={{ className: "!w-1/2", disabled: isDeleting }}
    />
  );
};

export default DeleteAnrMonitoringPlots;
