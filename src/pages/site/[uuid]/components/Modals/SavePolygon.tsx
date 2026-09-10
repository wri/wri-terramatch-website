import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

import type { PolygonTableRow } from "../PolygonTableRow";
export interface SavePolygonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygon: PolygonTableRow;
  onSave?: () => void | Promise<void>;
  showSaveAndRunValidation?: boolean;
  onSaveAndRunValidation?: () => void | Promise<void>;
}

const SavePolygon: FC<SavePolygonProps> = ({
  open,
  onOpenChange,
  polygon,
  onSave,
  showSaveAndRunValidation = false,
  onSaveAndRunValidation
}) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAndRunningValidation, setIsSavingAndRunningValidation] = useState(false);
  const isActionInProgress = isSaving || isSavingAndRunningValidation;

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSave = useCallback(async () => {
    if (onSave == null) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSave();
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, onOpenChange]);

  const handleSaveAndRunValidation = useCallback(async () => {
    if (onSaveAndRunValidation == null) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSavingAndRunningValidation(true);
      await onSaveAndRunValidation();
      onOpenChange(false);
    } finally {
      setIsSavingAndRunningValidation(false);
    }
  }, [onSaveAndRunValidation, onOpenChange]);

  const footerButtons = [
    {
      id: "cancel",
      variant: "secondary" as const,
      children: t("Cancel"),
      disabled: isActionInProgress,
      onClick: handleClose
    },
    {
      id: "save",
      variant: "secondary" as const,
      children: t("Save"),
      disabled: isActionInProgress,
      loading: isSaving,
      onClick: () => void handleSave()
    },
    ...(showSaveAndRunValidation
      ? [
          {
            id: "save-and-run-validation",
            children: t("Save and Run Validation"),
            className: "pr-4",
            disabled: isActionInProgress,
            loading: isSavingAndRunningValidation,
            onClick: () => void handleSaveAndRunValidation()
          }
        ]
      : [])
  ];

  return (
    <Modal
      modal={false}
      trapFocus={false}
      restoreFocus={false}
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{t("Save Changes?")}</b>}
      content={
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
          <Text textStyle="400" color="neutral.900" textAlign="center">
            {t("Are you sure you want to save changes to ")}
          </Text>
          <Text textStyle="500-bold" color="neutral.900" textAlign="center">
            {polygon.polygonName}?
          </Text>
        </Flex>
      }
      footer={<ButtonGroup buttons={footerButtons} />}
    />
  );
};

export default SavePolygon;
