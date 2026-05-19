import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";

export interface SubmitPolygonsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const SubmitPolygons: FC<SubmitPolygonsProps> = ({ open, onOpenChange }) => {
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
      header={<b className="text-theme-neutral-800">{t("Submit polygons?")}</b>}
      content={
        <Box px={4}>
          <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} mb={3} alignItems={"center"}>
            <WarningIcon boxSize={4} color={"warning.500"} mr={1.5} />
            <Text textStyle="400-bold" color="neutral.900" mr={0.5}>
              {t("5 of 8")}
            </Text>
            {t("selected polygons are eligible for submission.")}
          </Text>
          <Text textStyle="400" color="neutral.900">
            3 polygons are already Pending Approval or Approved and won’t be submitted.
          </Text>
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
              id: "submit",
              children: t("Submit"),
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default SubmitPolygons;
