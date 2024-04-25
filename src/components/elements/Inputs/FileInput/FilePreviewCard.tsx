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
import { FileCardContentVariant, FilePreviewCardVariant, VARIANT_FILE_PREVIEW_CARD_DEFAULT } from "./FileInputVariants";

export interface FilePreviewCardProps {
  file: Partial<UploadedFile>;
  className?: string;
  variant?: FilePreviewCardVariant;
  showPrivateCheckbox?: boolean;
  onDelete?: (file: Partial<UploadedFile>) => void;
  onPrivateChange?: (file: Partial<UploadedFile>, checked: boolean) => void;
}

const FilePreviewCard = ({
  file,
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
  const image = { isVerified: true };

  return (
    <div className={tw(variant.fileWrapper, className)}>
      <div className={variant.fileCardContent}>
        <When condition={file.uuid || file.uploadState?.isSuccess}>
          <Uploaded
            title={file?.title || file?.file_name || ""}
            file={file as UploadedFile}
            showPrivateCheckbox={showPrivateCheckbox}
            onPrivateChange={handlePrivateChange}
            variant={variant.fileCardContentVariant}
          />
        </When>
        <When condition={file?.uploadState?.isLoading}>
          <Uploading
            title={file?.title || file?.file_name || ""}
            file={file as UploadedFile}
            variant={variant.fileCardContentVariant}
          />
        </When>

        <When condition={!!file.uploadState?.error}>
          <Failed
            title={file?.title || file?.file_name || ""}
            errorMessage={file.uploadState?.error!}
            variant={variant.fileCardContentVariant}
          />
        </When>
      </div>
      <If condition={file.uploadState?.isLoading || file.uploadState?.isDeleting}>
        <Then>
          <Lottie animationData={SpinnerLottie} className="h-8 w-8" />
        </Then>
        <Else>
          <div className="flex items-center gap-4">
            <IconButton
              type="button"
              onClick={() => onDelete?.(file)}
              aria-label="Delete button"
              iconProps={{
                name: IconNames.TRASH_CIRCLE,
                className: "fill-error",
                width: 32
              }}
            />
            <When condition={variant.type === "image"}>
              <div
                className={classNames("flex w-[146px] items-center justify-center rounded border py-2", {
                  "border-green-400": image.isVerified,
                  "border-red": !image.isVerified
                })}
              >
                <Text
                  variant="text-12-bold"
                  className={classNames({ "text-green-400": image.isVerified, "text-red": !image.isVerified })}
                >
                  {image.isVerified ? "GeoTagged Verified" : "Not Verified"}
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
  variant: FileCardContentVariant;
}

const Uploading = ({ title, file, variant }: UploadingProps) => {
  const t = useT();
  const { format } = useFileSize();

  return (
    <FileCardContent
      title={title}
      variant={variant}
      subtitle={`${format(file.size)} • ${t("Uploading document ...")}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-primary-50"
    />
  );
};

interface UploadedProps extends UploadingProps {
  showPrivateCheckbox?: boolean;
  onPrivateChange: (checked: boolean) => void;
  variant: FileCardContentVariant;
}

const Uploaded = ({ title, file, showPrivateCheckbox, onPrivateChange, variant }: UploadedProps) => {
  const t = useT();
  const { format } = useFileSize();

  return (
    <FileCardContent
      title={title}
      subtitle={`${format(file.size)} • ${t("Document Uploaded")}`}
      file={file}
      variant={variant}
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
  variant: FileCardContentVariant;
}

const Failed = ({ title, errorMessage, variant }: FailedContentProps) => {
  const t = useT();

  return (
    <FileCardContent
      title={title}
      variant={variant}
      errorMessage={`${errorMessage} • ${t("Upload Failed")}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-primary-50"
    />
  );
};

export default FilePreviewCard;
