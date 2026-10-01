import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
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

  const handleSave = useCallback(async () => {
    if (onSubmit == null || eligibleCount === 0) {
      onOpenChange(false);
      return;
    }

    await onSubmit();
    onOpenChange(false);
  }, [eligibleCount, onOpenChange, onSubmit]);

  return (
    <ModalConfirmation
      open={open}
      onOpenChange={onOpenChange}
      size="medium"
      title={t("Submit polygons?")}
      contentLayout="custom"
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
              {t(
                "{skippedCount} polygons are already Pending Approval, Approved, or failed validations and won't be submitted.",
                { skippedCount }
              )}
            </Text>
          )}
        </Box>
      }
      confirmButton={{
        id: "submit",
        children: t("Submit"),
        disabled: eligibleCount === 0,
        onClick: () => void handleSave()
      }}
      cancelButton={{ autoFocus: true }}
    />
  );
};

export default SubmitPolygons;
