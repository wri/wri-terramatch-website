import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

import type { NurseryIndexRow } from "../../nurseryIndex.types";
import NurseryNameList from "./NurseryNameList";

export interface DeleteNurseryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nurseries: NurseryIndexRow[];
  onDelete?: () => void | Promise<void>;
}

const DeleteNursery: FC<DeleteNurseryProps> = ({ open, onOpenChange, nurseries, onDelete }) => {
  const t = useT();
  const isSingleNursery = nurseries.length === 1;

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleDelete = useCallback(async () => {
    if (onDelete == null) {
      onOpenChange(false);
      return;
    }
    await onDelete();
    onOpenChange(false);
  }, [onDelete, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {isSingleNursery ? t("Delete nursery?") : t("Delete nurseries?")}
        </Text>
      }
      content={
        isSingleNursery ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {nurseries[0].name}
            </Text>
            <Text textStyle="400" color="neutral.900" textAlign="center">
              {t("will be permanently removed.")}
            </Text>
            <Text textStyle="400-bold" color="neutral.900" textAlign="center">
              {t("You can’t undo this.")}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" mb={3}>
              <span>
                {t("The following nurseries will be permanently removed. {action}", {
                  action: (
                    <Text textStyle="400-bold" color="neutral.900" as="span">
                      {t("You can’t undo this.")}
                    </Text>
                  )
                })}
              </span>
            </Text>
            <NurseryNameList names={nurseries.map(nursery => nursery.name ?? t("Nursery"))} />
          </Box>
        )
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: handleClose
            },
            {
              id: "delete",
              children: t("Delete"),
              variant: "negative",
              classNameContainer: "!w-[50%]",
              className: "!w-[50%]",
              onClick: () => void handleDelete()
            }
          ]}
        />
      }
    />
  );
};

export default DeleteNursery;
