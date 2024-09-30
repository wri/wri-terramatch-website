import { useT } from "@transifex/react";
import classNames from "classnames";
import { When } from "react-if";

import IconButton from "@/components/elements/IconButton/IconButton";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { UploadedFile } from "@/types/common";

import Text from "../Text/Text";

export type FilePreviewCardProps = {
  accessLevel?: "public" | "private";
  file: UploadedFile;
  onDelete?: (file: UploadedFile) => void;
  onDownload?: (file: UploadedFile) => void;
  className?: string;
};

const FilePreviewCard = ({ accessLevel, file, onDelete, onDownload, className }: FilePreviewCardProps) => {
  const t = useT();

  return (
    <div className={classNames("flex items-center justify-between rounded-xl bg-white p-4 pr-6 shadow", className)}>
      <div className="flex flex-1 items-center justify-center gap-2">
        <div
          className="flex items-center justify-center rounded-lg bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${file.url})` }}
        >
          <When condition={!file.mime_type?.includes("image")}>
            <Icon name={IconNames.DOCUMENT} />
          </When>
        </div>
        <div className="flex flex-1 flex-col items-start gap-1">
          <Text variant="text-body-900" className=" line-clamp-1 capitalize">
            {file.title || file.file_name}
          </Text>
          <When condition={accessLevel}>
            <Text variant="text-body-600">{accessLevel === "public" ? t("Public") : t("Private")}</Text>
          </When>
        </div>
      </div>
      <When condition={!!onDelete}>
        <IconButton
          onClick={() => onDelete?.(file)}
          iconProps={{
            name: IconNames.TRASH_CIRCLE,
            className: " fill-error",
            width: 24,
            height: 28
          }}
        />
      </When>
      <When condition={!!onDownload}>
        <IconButton
          onClick={() => onDownload?.(file)}
          iconProps={{
            name: IconNames.DOWNLOAD,
            width: 24,
            height: 28
          }}
        />
      </When>
    </div>
  );
};

export default FilePreviewCard;
