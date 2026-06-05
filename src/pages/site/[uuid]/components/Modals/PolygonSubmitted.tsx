import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

export interface PolygonSubmittedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string[];
}

const PolygonSubmitted: FC<PolygonSubmittedProps> = ({ open, onOpenChange, polygons }) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isSinglePolygon = polygons.length === 1;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <b className="text-theme-neutral-800">{isSinglePolygon ? t("Polygon submitted") : t("Polygons submitted")}</b>
      }
      content={
        isSinglePolygon ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
            <CheckApprovedIcon boxSize={8} color={"success.500"} mb={2} />
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {polygons[0]}
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
                {polygons.map((item, index) => (
                  <List.Item
                    key={`${item}-${index}`}
                    _marker={{
                      color: "neutral.900"
                    }}
                  >
                    <Text textStyle="400" color="neutral.900">
                      {item}
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
              className: "!w-fit",
              variant: "secondary",
              children: t("Close"),
              autoFocus: true,
              onClick: handleClose
            }
          ]}
        />
      }
    />
  );
};

export default PolygonSubmitted;
