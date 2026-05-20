import { Box, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";

export interface UploadErrorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const UploadError: FC<UploadErrorProps> = ({ open, onOpenChange }) => {
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      blocking
      header={<b className="text-theme-neutral-800">{t("Upload error")}</b>}
      content={
        <Box px={4}>
          <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} alignItems={"center"}>
            <InformationRequiredIcon boxSize={4} color={"error.500"} mr={1.5} />
            {t("This file contains both points and polygons. ")}
          </Text>
          <Text textStyle="400-bold" color="neutral.900" ml={7} mb={3}>
            {t("Files must contain only one geometry type.")}
          </Text>
          <Text textStyle="300" color="neutral.800" ml={7} mb={3}>
            {t("Upload either:")}
          </Text>
          <Box ml={14}>
            <List.Root as="ul" spaceY={1} listStyleType="disc">
              <List.Item
                _marker={{
                  color: "neutral.900"
                }}
              >
                <Text textStyle="300" color="neutral.800">
                  {t("Points only")}
                </Text>
              </List.Item>
              <List.Item
                _marker={{
                  color: "neutral.900"
                }}
              >
                <Text textStyle="300" color="neutral.800">
                  {t("Polygons or multipolygons only")}
                </Text>
              </List.Item>
            </List.Root>
          </Box>
        </Box>
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

export default UploadError;
