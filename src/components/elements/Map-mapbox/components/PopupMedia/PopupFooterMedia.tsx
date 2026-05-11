import { Grid } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

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
  const cols = showCover ? 4 : 3;

  return (
    <Grid templateColumns={`repeat(${cols}, 1fr)`} gap={2} width="100%" padding="0.75rem">
      <Button variant="secondary" size="small" leftIcon={<DownloadIcon />} onClick={onDownload}>
        {t("Download")}
      </Button>
      <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={onEdit}>
        {t("Edit")}
      </Button>
      {showCover ? (
        <Button variant="secondary" size="small" leftIcon={<PhotosIcon />} onClick={onMakeCover}>
          {t("Cover")}
        </Button>
      ) : null}
      <Button variant="secondary" size="small" leftIcon={<DeleteIcon />} onClick={onDelete}>
        {t("Delete")}
      </Button>
    </Grid>
  );
};

export default PopupFooterMedia;
