import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";

import type { PolygonTableRow } from "../../tabs/Polygons";

export interface SubmitPolygonConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  onSubmit?: () => void | Promise<void>;
}

const SubmitPolygonConfirmation: FC<SubmitPolygonConfirmationProps> = ({ open, onOpenChange, polygons, onSubmit }) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSave = useCallback(async () => {
    if (onSubmit == null) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit();
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [onSubmit, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <b className="text-theme-neutral-800">{polygons.length === 1 ? t("Submit Polygon?") : t("Submit Polygons?")}</b>
      }
      content={
        polygons.length === 1 ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2}>
            <WarningIcon boxSize={8} color={"warning.500"} mb={2} />
            <Text textStyle="400" color="neutral.900" mb={3}>
              {t("Are you sure you want to submit")}
            </Text>
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {polygons[0].polygonName}?
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} alignItems={"center"}>
              {t("Are you sure you want to submit these polygons?")}
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
              id: "save",
              children: t("Yes, submit"),
              disabled: isSaving,
              onClick: () => void handleSave()
            }
          ]}
        />
      }
    />
  );
};

export default SubmitPolygonConfirmation;
