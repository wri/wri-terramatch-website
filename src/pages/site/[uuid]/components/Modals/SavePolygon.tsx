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
}

const SavePolygon: FC<SavePolygonProps> = ({ open, onOpenChange, polygon, onSave }) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);

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
              children: t("Yes, save"),
              disabled: isSaving,
              onClick: () => void handleSave()
            }
          ]}
        />
      }
    />
  );
};

export default SavePolygon;
