import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { PolygonTableRow } from "../PolygonTableRow";
import ValidationSection from "./ValidationSection";

export interface SystemValidationCompleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
}
const SystemValidationComplete: FC<SystemValidationCompleteProps> = ({ open, onOpenChange, polygons }) => {
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

  const approvalValidations = polygons.filter(item => item.validation === "passed");

  const failedValidations = polygons.filter(item => item.validation === "failed");

  const partiallyPassedValidations = polygons.filter(item => item.validation === "partially-passed");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      blocking
      header={<b className="text-theme-neutral-800">{t("System validation complete")}</b>}
      content={
        <Flex px={4} direction="column" gap={3}>
          <ValidationSection polygons={approvalValidations} color="success.500" />
          {approvalValidations.length > 0 && partiallyPassedValidations.length > 0 && <SimpleDivider />}
          <ValidationSection polygons={partiallyPassedValidations} color="warning.500" />
          {partiallyPassedValidations.length > 0 && failedValidations.length > 0 && <SimpleDivider />}
          <ValidationSection polygons={failedValidations} color="error.500" />
        </Flex>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "close",
              variant: "secondary",
              children: t("Close"),
              className: "w-fit",
              onClick: handleClose
            }
          ]}
        />
      }
    />
  );
};

export default SystemValidationComplete;
