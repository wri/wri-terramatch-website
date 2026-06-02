import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

export interface BulkEditPolygonAttributesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygonNames: string[];
  canConfirm: boolean;
  isSaving?: boolean;
  onConfirm?: () => void | Promise<void>;
}

const BulkEditPolygonAttributes: FC<BulkEditPolygonAttributesProps> = ({
  open,
  onOpenChange,
  polygonNames,
  canConfirm,
  isSaving = false,
  onConfirm
}) => {
  const t = useT();
  useModalScrollFix(open);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(async () => {
    if (onConfirm == null || !canConfirm) {
      onOpenChange(false);
      return;
    }

    await onConfirm();
  }, [canConfirm, onConfirm, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{t("Edit Details")}</b>}
      content={
        <Box px={4}>
          <Text textStyle="500" color="neutral.900" mb={5}>
            {t("Are you sure you want to")}
            <Text as="span" textStyle="500-bold" color="neutral.900" mx={1}>
              {t("update")}
            </Text>
            {t("the following polygons?")}
          </Text>
          <Flex flexDirection="column" gap={4} bg="primary.100" py={4} px={6} rounded={4}>
            <List.Root as="ul" pl={4} spaceY={3} listStyleType="disc">
              {polygonNames.map((name, index) => (
                <List.Item
                  key={`${name}-${index}`}
                  _marker={{
                    color: "neutral.900"
                  }}
                >
                  <Text textStyle="500" color="neutral.900" as="span">
                    {name}
                  </Text>
                </List.Item>
              ))}
            </List.Root>
          </Flex>
        </Box>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              disabled: isSaving,
              onClick: handleClose
            },
            {
              id: "confirm",
              children: t("Yes, update"),
              disabled: isSaving || !canConfirm,
              loading: isSaving,
              onClick: () => void handleConfirm()
            }
          ]}
        />
      }
    />
  );
};

export default BulkEditPolygonAttributes;
