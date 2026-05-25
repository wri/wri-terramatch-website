import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";

export interface SubmitPolygonsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eligibleCount: number;
  totalCount: number;
  onSubmit?: () => void | Promise<void>;
}
const SubmitPolygons: FC<SubmitPolygonsProps> = ({ open, onOpenChange, eligibleCount, totalCount, onSubmit }) => {
  const t = useT();
  const skippedCount = totalCount - eligibleCount;
  useModalScrollFix(open);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSave = useCallback(async () => {
    if (onSubmit == null || eligibleCount === 0) {
      onOpenChange(false);
      return;
    }

    onOpenChange(false);
    await onSubmit();
  }, [eligibleCount, onOpenChange, onSubmit]);

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
              {t("{eligibleCount} of {totalCount}", { eligibleCount, totalCount })}
            </Text>
            {t("selected polygons are eligible for submission.")}
          </Text>
          {skippedCount > 0 && (
            <Text textStyle="400" color="neutral.900">
              {t("{skippedCount} polygons are already Pending Approval or Approved and won't be submitted.", {
                skippedCount
              })}
            </Text>
          )}
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
              disabled: eligibleCount === 0,
              onClick: () => void handleSave()
            }
          ]}
        />
      }
    />
  );
};

export default SubmitPolygons;
