import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

const MocketDataPolygonUUID = [
  "Polygon UUID 1",
  "Polygon UUID 2",
  "Polygon UUID 3",
  "Polygon UUID 4",
  "Polygon UUID 5",
  "Polygon UUID 6"
];

export interface MatchingPolygonsFoundProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const MatchingPolygonsFound: FC<MatchingPolygonsFoundProps> = ({ open, onOpenChange }) => {
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
      header={<b className="text-theme-neutral-800">{t("Matching polygons found")}</b>}
      content={
        <Box px={4}>
          <Text textStyle="400" color="neutral.900">
            {t("These files match existing polygons.")}
          </Text>
          <Text textStyle="400-bold" color="neutral.900" display={"flex"} mb={3} gap={0.5}>
            {t("New versions")}
            <Text>{t(" will be created for:")}</Text>{" "}
          </Text>
          <Flex flexDirection="column" gap={4} bg={"primary.100"} py={2} px={3} rounded={4}>
            <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
              {MocketDataPolygonUUID.map(item => (
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
              id: "create-new-versions",
              children: t("Create new versions"),
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default MatchingPolygonsFound;
