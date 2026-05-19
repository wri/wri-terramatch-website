import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";

export interface DeletePolygonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string | string[];
}
const DeletePolygon: FC<DeletePolygonProps> = ({ open, onOpenChange, polygons }) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSave = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);
  useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-scroll-locked");
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      blocking
      header={
        <b className="text-theme-neutral-800">
          {typeof polygons === "string" ? t("Delete polygon?") : t("Delete polygons?")}
        </b>
      }
      content={
        typeof polygons === "string" ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2}>
            <WarningIcon boxSize={8} color={"warning.500"} mb={2} />
            <Text textStyle="400" color="neutral.900">
              {t("Are you sure you want to delete")}
            </Text>
            <Text textStyle="600-bold" color="neutral.900">
              {polygons}?
            </Text>

            <Text textStyle="400-bold" color="warning.900" mt={2}>
              {t("This action cannot be undone.")}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} alignItems={"center"}>
              <WarningIcon boxSize={4} color={"warning.500"} mr={2} />
              {t("Are you sure you want to")}
              <Text textStyle="400-bold" color="neutral.900" mx={0.5}>
                {t("delete")}
              </Text>
              {t("these polygons?")}
            </Text>
            <Text textStyle="400-bold" color="warning.900" ml={7} mb={3}>
              This action cannot be undone.
            </Text>
            <Flex flexDirection="column" gap={4} bg={"neutral.200"} py={2} px={3} rounded={4}>
              <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
                {polygons.map(item => (
                  <List.Item
                    key={item}
                    _marker={{
                      color: "neutral.900"
                    }}
                  >
                    <Text textStyle="400" color="neutral.900">
                      {t(item)}
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
              className: "!border !w-[50%] !border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default DeletePolygon;
