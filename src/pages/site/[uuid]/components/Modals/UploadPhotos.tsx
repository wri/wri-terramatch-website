import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";

export interface UploadPhotosWarningContentProps {
  nonGeotaggedCount?: number;
}

export const UploadPhotosWarningContent: FC<UploadPhotosWarningContentProps> = ({ nonGeotaggedCount }) => {
  const t = useT();

  return (
    <Flex px={4} gap={2} alignItems={"baseline"}>
      <WarningIcon boxSize={4} color={"warning.500"} mr={1.5} />
      <Text textStyle="400" color="neutral.900" mb={3}>
        <Text textStyle="400-bold" color="neutral.900" mr={1} as="span">
          {nonGeotaggedCount ?? t("X")}
        </Text>
        {t(
          "images don't include location data and won't appear on the map. They'll be saved to the Site Gallery instead."
        )}
      </Text>
    </Flex>
  );
};

export interface UploadPhotosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nonGeotaggedCount?: number;
  onConfirm?: () => void;
}
const UploadPhotos: FC<UploadPhotosProps> = ({ open, onOpenChange, nonGeotaggedCount, onConfirm }) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(() => {
    onOpenChange(false);
    onConfirm?.();
  }, [onConfirm, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{t("Upload photos?")}</b>}
      content={<UploadPhotosWarningContent nonGeotaggedCount={nonGeotaggedCount} />}
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
              onClick: handleConfirm
            }
          ]}
        />
      }
    />
  );
};

export default UploadPhotos;
