import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

import type { PolygonTableRow } from "../../tabs/Polygons";
export interface SavePolygonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygon: PolygonTableRow;
  onSave?: () => void | Promise<void>;
  showSaveAndSubmit?: boolean;
  onSaveAndSubmit?: () => void | Promise<void>;
}

const SavePolygon: FC<SavePolygonProps> = ({
  open,
  onOpenChange,
  polygon,
  onSave,
  showSaveAndSubmit = false,
  onSaveAndSubmit
}) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAndSubmitting, setIsSavingAndSubmitting] = useState(false);
  const isActionInProgress = isSaving || isSavingAndSubmitting;

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

  const handleSaveAndSubmit = useCallback(async () => {
    if (onSaveAndSubmit == null) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSavingAndSubmitting(true);
      await onSaveAndSubmit();
      onOpenChange(false);
    } finally {
      setIsSavingAndSubmitting(false);
    }
  }, [onSaveAndSubmit, onOpenChange]);

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
    ...(showSaveAndSubmit
      ? [
          {
            id: "save-and-submit",
            children: t("Save and Submit"),
            className: "pr-4",
            disabled: isActionInProgress,
            loading: isSavingAndSubmitting,
            onClick: () => void handleSaveAndSubmit()
          }
        ]
      : [])
  ];

  return (
    <Modal
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
