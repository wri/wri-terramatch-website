import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import RadioButtonGroup from "@/redesignComponents/Forms/Actions/RadioButton/Radio";
import { UploadIcon } from "@/redesignComponents/foundations/Icons";

export interface UploadPolygonsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const UploadPolygons: FC<UploadPolygonsProps> = ({ open, onOpenChange }) => {
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
      header={<b className="text-theme-neutral-800">{t("Upload Polygons")}</b>}
      content={
        <Box px={4}>
          <Text mb={3} textStyle="400-bold" color="neutral.900">
            {t("Choose an upload option:")}
          </Text>
          <RadioButtonGroup
            name="default-checked"
            options={[
              {
                label: t("New polygons"),
                value: "new-polygons"
              },
              {
                label: t("Update existing polygons"),
                value: "update-existing-polygons"
              }
            ]}
          />
          <Text mt={2} mb={4} textStyle="300" color="neutral.900">
            {t("To update existing polygons, the files must have the original UUID")}
          </Text>
          <Flex
            flexDirection="column"
            gap={4}
            bg={"neutral.200"}
            justifyContent={"center"}
            alignItems={"center"}
            py={4}
            rounded={2}
          >
            <Flex justifyContent={"center"} alignItems={"center"} flexDirection="column" gap={0}>
              <Text color="neutral.900" textStyle="400">
                {t("Drag and drop your files here or")}
              </Text>
              <Button leftIcon={<UploadIcon />} variant="borderless">
                {t("Click to upload")}
              </Button>
            </Flex>
            <Flex justifyContent={"center"} alignItems={"center"} flexDirection="column" gap={0}>
              <Text textStyle="300" color="neutral.700">
                {t("Accepted formats: GeoJSON, Shapefile, and KML.")}
              </Text>
              <Text textStyle="300" color="neutral.700" display={"flex"} gap={0.5}>
                {t("Upload size limit:")}{" "}
                <Text textStyle="300-bold" color="neutral.700">
                  XX MB
                </Text>
                .
              </Text>
            </Flex>
          </Flex>
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
              id: "save",
              children: t("Save"),
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default UploadPolygons;
