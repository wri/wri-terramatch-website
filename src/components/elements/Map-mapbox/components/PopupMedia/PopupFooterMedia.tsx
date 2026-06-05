import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, memo } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DeleteIcon, DownloadIcon, EditIcon, PhotosIcon } from "@/redesignComponents/foundations/Icons";

type PopupFooterMediaProps = {
  isProjectPath: boolean;
  onDownload: () => void;
  onEdit: () => void;
  onMakeCover: () => void;
  onDelete: () => void;
};

const PopupFooterMedia: FC<PopupFooterMediaProps> = ({ isProjectPath, onDownload, onEdit, onMakeCover, onDelete }) => {
  const t = useT();
  const showCover = isProjectPath;

  return (
    <Flex justifyContent="space-between" gap={0} width="100%" wrap="wrap">
      <Button
        variant="secondary"
        size="small"
        leftIcon={<DeleteIcon color="error.500" />}
        onClick={onDelete}
        classNameContainer="w-fit"
        typeVariant="negative"
        className="!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900"
      >
        {t("Delete")}
      </Button>
      <Button variant="secondary" size="small" leftIcon={<DownloadIcon />} onClick={onDownload} className="w-fit">
        {t("Download")}
      </Button>
      <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={onEdit} className="w-fit">
        {t("Edit")}
      </Button>
      {showCover ? (
        <Button variant="secondary" size="small" leftIcon={<PhotosIcon />} onClick={onMakeCover} className="w-fit">
          {t("Cover")}
        </Button>
      ) : null}
    </Flex>
  );
};

export default memo(PopupFooterMedia);
