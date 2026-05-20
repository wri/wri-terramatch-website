import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";

export interface UploadPhotosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const UploadPhotos: FC<UploadPhotosProps> = ({ open, onOpenChange }) => {
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
      header={<b className="text-theme-neutral-800">{t("Upload photos?")}</b>}
      content={
        <Flex px={4} gap={2} alignItems={"baseline"}>
          <WarningIcon boxSize={4} color={"warning.500"} mr={1.5} />
          <Text textStyle="400" color="neutral.900" mb={3}>
            <Text textStyle="400-bold" color="neutral.900" mr={1} as="span">
              {t("X")}
            </Text>
            {t(
              "images don’t include location data and won’t appear on the map. They’ll be saved to the Site Gallery instead."
            )}
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
              id: "submit",
              children: t("Upload photos"),
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default UploadPhotos;
