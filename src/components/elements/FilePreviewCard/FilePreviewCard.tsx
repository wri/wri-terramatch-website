import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

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

const FilePreviewCard: FC<FilePreviewCardProps> = ({ accessLevel, file, onDelete, onDownload, className }) => {
  const t = useT();

  return (
    <div className={classNames("flex items-center justify-between rounded-xl bg-white p-4 pr-6 shadow", className)}>
      <div className="flex flex-1 items-center justify-center gap-2">
        <div
          className="flex items-center justify-center rounded-lg bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${file.url})` }}
        >
          {!file.mimeType.includes("image") && <Icon name={IconNames.DOCUMENT} />}
        </div>
        <div className="flex flex-1 flex-col items-start gap-1">
          <Text variant="text-body-900" className=" capitalize line-clamp-1">
            {file.fileName}
          </Text>
          {accessLevel != null && (
            <Text variant="text-body-600">{accessLevel === "public" ? t("Public") : t("Private")}</Text>
          )}
        </div>
      </div>
      {onDelete != null && (
        <IconButton
          onClick={() => onDelete(file)}
          iconProps={{
            name: IconNames.TRASH_CIRCLE,
            className: " fill-error",
            width: 24,
            height: 28
          }}
        />
      )}
      {onDownload != null && (
        <IconButton
          onClick={() => onDownload(file)}
          iconProps={{
            name: IconNames.DOWNLOAD,
            width: 24,
            height: 28
          }}
        />
      )}
    </div>
  );
};

export default FilePreviewCard;
