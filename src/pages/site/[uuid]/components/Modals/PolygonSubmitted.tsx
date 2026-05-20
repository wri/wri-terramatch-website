import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

export interface PolygonSubmittedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string | string[];
}
const PolygonSubmitted: FC<PolygonSubmittedProps> = ({ open, onOpenChange, polygons }) => {
  const t = useT();

  const handleClose = useCallback(() => {
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
          {typeof polygons === "string" ? t("Polygon submitted") : t("Polygons submitted")}
        </b>
      }
      content={
        typeof polygons === "string" ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2}>
            <CheckApprovedIcon boxSize={8} color={"success.500"} mb={2} />
            <Text textStyle="600-bold" color="neutral.900">
              {polygons}
            </Text>

            <Text textStyle="400" color="neutral.900">
              {t("has been submitted.")}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} mb={3} alignItems={"center"}>
              <CheckApprovedIcon boxSize={4} color={"success.500"} mr={2} />
              {t("The following Polygons")}
              <Text textStyle="400-bold" color="neutral.900" ml={0.5}>
                {t("have been submitted:")}
              </Text>
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
              id: "close",
              variant: "secondary",
              className: "w-fit",
              children: t("Close"),
              onClick: handleClose
            }
          ]}
        />
      }
    />
  );
};

export default PolygonSubmitted;
