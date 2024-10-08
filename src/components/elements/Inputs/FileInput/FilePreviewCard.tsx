import { useT } from "@transifex/react";
import classNames from "classnames";
import Lottie from "lottie-react";
import { Else, If, Then, When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import SpinnerLottie from "@/assets/animations/spinner.json";
import IconButton from "@/components/elements/IconButton/IconButton";
import { FileCardContent } from "@/components/elements/Inputs/FileInput/FileCardContent";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useFileSize } from "@/hooks/useFileSize";
import { UploadedFile } from "@/types/common";

import Text from "../../Text/Text";
import { SUBTITLE_MAP_ON_FAILED } from "./constants/subtitleMapOnFailed";
import { SUBTITLE_MAP_ON_UPLOADED } from "./constants/subtitleMapOnUploaded";
import { SUBTITLE_MAP_ON_UPLOADING } from "./constants/subtitleMapOnUploading";
import { FilePreviewCardVariant, VARIANT_FILE_PREVIEW_CARD_DEFAULT } from "./FileInputVariants";

export interface FilePreviewCardProps {
  file: Partial<UploadedFile>;
  fileStatus?: boolean;
  className?: string;
  variant?: FilePreviewCardVariant;
  showPrivateCheckbox?: boolean;
  onDelete?: (file: Partial<UploadedFile>) => void;
  onPrivateChange?: (file: Partial<UploadedFile>, checked: boolean) => void;
}

const FilePreviewCard = ({
  file,
  fileStatus,
  className,
  showPrivateCheckbox,
  onDelete,
  onPrivateChange,
  variant = VARIANT_FILE_PREVIEW_CARD_DEFAULT
}: FilePreviewCardProps) => {
  const handlePrivateChange = (checked: boolean) => {
    if (!file) return;

    onPrivateChange?.(file, checked);
  };
  const t = useT();

  return (
    <div className={tw(variant.fileWrapper, className)}>
      <div className={variant.fileCardContent}>
        <When condition={file.uuid || file.uploadState?.isSuccess}>
          <Uploaded
            title={file?.title || file?.file_name || ""}
            file={file as UploadedFile}
            showPrivateCheckbox={showPrivateCheckbox}
            onPrivateChange={handlePrivateChange}
            variant={variant}
          />
        </When>
        <When condition={file?.uploadState?.isLoading}>
          <Uploading title={file?.title || file?.file_name || ""} file={file as UploadedFile} variant={variant} />
        </When>

        <When condition={!!file.uploadState?.error}>
          <Failed
            title={file?.title || file?.file_name || ""}
            errorMessage={file.uploadState?.error!}
            variant={variant}
          />
        </When>
      </div>
      <If condition={file.uploadState?.isLoading || file.uploadState?.isDeleting}>
        <Then>
          <Lottie animationData={SpinnerLottie} className="h-8 w-8" />
        </Then>
        <Else>
          <div className="ml-auto flex items-center gap-4 self-end">
            <IconButton
              type="button"
              onClick={() => onDelete?.(file)}
              aria-label={t("Delete button")}
              iconProps={{
                name:
                  variant.type === "image" || variant.type === "geoFile" ? IconNames.TRASH_PA : IconNames.TRASH_CIRCLE,
                className: "fill-error text-grey-700",
                width: 32
              }}
            />
            <When condition={variant.type === "image" && fileStatus}>
              <div
                className={classNames("flex items-center justify-center rounded border py-2", {
                  "border-blue": fileStatus,
                  "border-red": !fileStatus,
                  "w-[146px]": variant.typeModal === "UploadImage"
                })}
              >
                <Text
                  variant="text-12-bold"
                  className={classNames("text-center", {
                    "text-blue": fileStatus,
                    "text-red": !fileStatus
                  })}
                >
                  {fileStatus ? t("GeoTagged Verified") : t("Not Verified")}
                </Text>
              </div>
            </When>
            <When condition={variant.type === "geoFile"}>
              <Icon name={IconNames.CHECK_POLYGON} className="h-6 w-6" />
            </When>
          </div>
        </Else>
      </If>
    </div>
  );
};

interface UploadingProps {
  title: string;
  file: UploadedFile;
  variant: FilePreviewCardVariant;
}

const Uploading = ({ title, file, variant }: UploadingProps) => {
  const t = useT();
  const { format } = useFileSize();

  let subtitle;
  if (variant.type !== undefined && SUBTITLE_MAP_ON_UPLOADING[variant.type] !== undefined) {
    subtitle = SUBTITLE_MAP_ON_UPLOADING[variant.type];
  } else {
    subtitle = "Uploading document ...";
  }
  return (
    <FileCardContent
      title={title}
      variant={variant.fileCardContentVariant}
      subtitle={`${format(file.size)} • ${t(subtitle)}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-neutral-150"
    />
  );
};

interface UploadedProps extends UploadingProps {
  showPrivateCheckbox?: boolean;
  onPrivateChange: (checked: boolean) => void;
  variant: FilePreviewCardVariant;
}

const Uploaded = ({ title, file, showPrivateCheckbox, onPrivateChange, variant }: UploadedProps) => {
  const t = useT();
  const { format } = useFileSize();

  let subtitle;
  if (variant.type !== undefined && SUBTITLE_MAP_ON_UPLOADED[variant.type] !== undefined) {
    subtitle = SUBTITLE_MAP_ON_UPLOADED[variant.type];
  } else {
    subtitle = "Document Uploaded";
  }

  return (
    <FileCardContent
      title={title}
      subtitle={`${format(file.size)} • ${t(subtitle)}`}
      file={file}
      variant={variant.fileCardContentVariant}
      thumbnailClassName="fill-white"
      thumbnailContainerClassName="bg-success"
      onPrivateChange={onPrivateChange}
      showPrivateCheckbox={showPrivateCheckbox}
    />
  );
};

interface FailedContentProps {
  title: string;
  errorMessage: string;
  variant: FilePreviewCardVariant;
}

const Failed = ({ title, errorMessage: errorState, variant }: FailedContentProps) => {
  const t = useT();

  let errorMessage;
  if (variant.type !== undefined && SUBTITLE_MAP_ON_FAILED[variant.type] !== undefined) {
    errorMessage = SUBTITLE_MAP_ON_FAILED[variant.type];
  } else {
    errorMessage = "Upload Failed";
  }

  return (
    <FileCardContent
      title={title}
      variant={variant.fileCardContentVariant}
      errorMessage={`${errorState} • ${t(errorMessage)}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-neutral-150"
    />
  );
};

export default FilePreviewCard;
