import { Box, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";
import {
  getPolygonUploadErrorCopy,
  getPolygonUploadErrorTitle,
  resolvePolygonUploadErrorVariant
} from "@/utils/polygonUploadErrors";

export interface UploadErrorProps {
  open: boolean;
  backendErrorMessage?: string | null;
  onOpenChange: (open: boolean) => void;
}

const UploadError: FC<UploadErrorProps> = ({ open, backendErrorMessage, onOpenChange }) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const errorCopy = useMemo(() => {
    const variant = resolvePolygonUploadErrorVariant(backendErrorMessage ?? "");
    return getPolygonUploadErrorCopy(variant, t);
  }, [backendErrorMessage, t]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{getPolygonUploadErrorTitle(t)}</b>}
      content={
        <Box px={4}>
          <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} alignItems={"center"}>
            <InformationRequiredIcon boxSize={4} color={"error.500"} mr={1.5} />
            {errorCopy.summary}
          </Text>
          {errorCopy.emphasis != null && (
            <Text textStyle="400-bold" color="neutral.900" ml={7} mb={3}>
              {errorCopy.emphasis}
            </Text>
          )}
          {errorCopy.instructions != null && (
            <Text textStyle="300" color="neutral.800" ml={7} mb={3}>
              {errorCopy.instructions}
            </Text>
          )}
          {errorCopy.bullets != null && errorCopy.bullets.length > 0 && (
            <Box ml={14}>
              <List.Root as="ul" spaceY={1} listStyleType="disc">
                {errorCopy.bullets.map(bullet => (
                  <List.Item
                    key={bullet}
                    _marker={{
                      color: "neutral.900"
                    }}
                  >
                    <Text textStyle="300" color="neutral.800">
                      {bullet}
                    </Text>
                  </List.Item>
                ))}
              </List.Root>
            </Box>
          )}
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
