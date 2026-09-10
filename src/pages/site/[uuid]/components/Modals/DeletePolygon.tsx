import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

import type { PolygonTableRow } from "../PolygonTableRow";

export interface DeletePolygonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  onDelete?: () => void | Promise<void>;
  modal?: boolean;
  restoreFocus?: boolean;
}
const DeletePolygon: FC<DeletePolygonProps> = ({
  open,
  onOpenChange,
  polygons,
  onDelete,
  modal = true,
  restoreFocus = true
}) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSave = useCallback(() => {
    if (onDelete == null) {
      onOpenChange(false);
      return;
    }
    void onDelete();
    onOpenChange(false);
  }, [onDelete, onOpenChange]);

  return (
    <Modal
      modal={modal}
      restoreFocus={restoreFocus}
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {polygons.length === 1 ? t("Delete polygon?") : t("Delete polygons?")}
        </Text>
      }
      content={
        polygons.length === 1 ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {polygons[0].polygonName}?
            </Text>
            <Text textStyle="400" color="neutral.900" textAlign="center">
              {t("will be permanently removed from this site.")}
            </Text>

            <Text textStyle="400-bold" color="neutral.900" textAlign="center">
              {t("You can’t undo this.")}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" mb={3}>
              <span>
                {t("The following polygons will be permanently removed from this site. {action}", {
                  action: (
                    <Text textStyle="400-bold" color="neutral.900" as="span">
                      {t("You can’t undo this.")}
                    </Text>
                  )
                })}
              </span>
            </Text>
            <Flex flexDirection="column" gap={4} bg={"neutral.200"} py={2} px={3} rounded={4}>
              <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
                {polygons.map(item => (
                  <List.Item
                    key={item.id}
                    _marker={{
                      color: "neutral.900"
                    }}
                  >
                    <Text textStyle="400" color="neutral.900" as={"span"}>
                      {item.polygonName}
                    </Text>
                  </List.Item>
                ))}
              </List.Root>
            </Flex>
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
              onClick: () => void handleSave()
            }
          ]}
        />
      }
    />
  );
};

export default DeletePolygon;
