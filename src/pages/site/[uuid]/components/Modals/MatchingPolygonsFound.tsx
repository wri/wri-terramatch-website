import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

export interface MatchingPolygonsFoundProps {
  open: boolean;
  existingUuids: string[];
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const MatchingPolygonsFound: FC<MatchingPolygonsFoundProps> = ({ open, existingUuids, onOpenChange, onConfirm }) => {
  const t = useT();

  useModalScrollFix(open);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const handleConfirm = useCallback(async () => {
    await onConfirm();
    onOpenChange(false);
  }, [onConfirm, onOpenChange]);

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
          <Text textStyle="400-bold" color="neutral.900" display="flex" mb={3} gap={0.5}>
            {t("New versions")}
            <Text>{t(" will be created for:")}</Text>
          </Text>
          <Flex flexDirection="column" gap={4} bg="primary.100" py={2} px={3} rounded={4}>
            <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
              {existingUuids.map(uuid => (
                <List.Item key={uuid} _marker={{ color: "neutral.900" }}>
                  <Text textStyle="400" color="neutral.900">
                    {uuid}
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
              onClick: handleConfirm
            }
          ]}
        />
      }
    />
  );
};

export default MatchingPolygonsFound;
