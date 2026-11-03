import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import { MapMedia } from "../../layers/mediaTypes";
import PopupContentMedia from "./PopupContentMedia";
import PopupFooterMedia from "./PopupFooterMedia";
import PopupHeaderMedia from "./PopupHeaderMedia";

export type MediaPopupCardProps = {
  file: MapMedia;
  readOnly: boolean;
  isProjectPath: boolean;
  onClose: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onMakeCover: () => void;
  onDelete: () => void;
};

export const MediaPopupCard: FC<MediaPopupCardProps> = ({
  file,
  readOnly,
  isProjectPath,
  onClose,
  onDownload,
  onEdit,
  onMakeCover,
  onDelete
}) => (
  <Box
    bg="neutral.100"
    borderWidth="1px"
    borderColor="neutral.300"
    borderRadius="0.5rem"
    overflow="hidden"
    width="fit-content"
    maxW="max-content"
    boxShadow="0 0.0625rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.10), 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.10)"
  >
    <Flex align="center" justify="space-between" gap={2} px={4} pt={4} pb={2}>
      <PopupHeaderMedia name={file.name} />
      <CloseButton onClick={onClose} />
    </Flex>
    <PopupContentMedia uuid={file.uuid} thumbUrl={file.thumbUrl ?? ""} createdAt={file.createdAt} />
    {readOnly ? null : (
      <Box px={4} pb={4} pt={2}>
        <PopupFooterMedia
          isProjectPath={isProjectPath}
          onDownload={onDownload}
          onEdit={onEdit}
          onMakeCover={onMakeCover}
          onDelete={onDelete}
        />
      </Box>
    )}
  </Box>
);

export default MediaPopupCard;
