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
          className="flex h-16 w-16 items-center justify-center rounded-lg border border-neutral-400 border-opacity-20 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${file.url})` }}
        >
          <When condition={!file.mime_type?.includes("image")}>
            <Icon name={IconNames.DOCUMENT} width={22.5} height={30} />
          </When>
        </div>
        <div className="flex flex-1 flex-col items-start gap-1">
          <Text variant="text-heading-200" className=" capitalize line-clamp-1">
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
          className="h-11 w-11"
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
          className="h-11 w-11"
          iconProps={{
            name: IconNames.DOWNLOAD,
            className: "fill-black",
            width: 24,
            height: 28
          }}
        />
      </When>
    </div>
  );
};

export default FilePreviewCard;
