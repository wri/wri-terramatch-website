import { useT } from "@transifex/react";
import classNames from "classnames";
import Lottie from "lottie-react";
import { Else, If, Then, When } from "react-if";

import SpinnerLottie from "@/assets/animations/spinner.json";
import IconButton from "@/components/elements/IconButton/IconButton";
import { FileCardContent } from "@/components/elements/Inputs/FileInput/FileCardContent";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useFileSize } from "@/hooks/useFileSize";
import { UploadedFile } from "@/types/common";

export interface FilePreviewCardProps {
  file: Partial<UploadedFile>;
  className?: string;
  showPrivateCheckbox?: boolean;
  onDelete?: (file: Partial<UploadedFile>) => void;
  onPrivateChange?: (file: Partial<UploadedFile>, checked: boolean) => void;
}

const FilePreviewCard = ({ file, className, showPrivateCheckbox, onDelete, onPrivateChange }: FilePreviewCardProps) => {
  const handlePrivateChange = (checked: boolean) => {
    if (!file) return;

    onPrivateChange?.(file, checked);
  };

  return (
    <div
      className={classNames("flex w-full items-center justify-between gap-4 rounded-xl bg-white p-4 shadow", className)}
    >
      <div className="flex items-center justify-center gap-4">
        <When condition={file.uuid || file.uploadState?.isSuccess}>
          <Uploaded
            title={file?.title || file?.file_name || ""}
            file={file as UploadedFile}
            showPrivateCheckbox={showPrivateCheckbox}
            onPrivateChange={handlePrivateChange}
          />
        </When>
        <When condition={file?.uploadState?.isLoading}>
          <Uploading title={file?.title || file?.file_name || ""} file={file as UploadedFile} />
        </When>

        <When condition={!!file.uploadState?.error}>
          <Failed title={file?.title || file?.file_name || ""} errorMessage={file.uploadState?.error!} />
        </When>
      </div>
      <If condition={file.uploadState?.isLoading || file.uploadState?.isDeleting}>
        <Then>
          <Lottie animationData={SpinnerLottie} className="h-8 w-8" />
        </Then>
        <Else>
          <IconButton
            type="button"
            onClick={() => onDelete?.(file)}
            aria-label="Delete button"
            iconProps={{
              name: IconNames.TRASH_CIRCLE,
              className: " fill-error",
              width: 32
            }}
          />
        </Else>
      </If>
    </div>
  );
};

interface UploadingProps {
  title: string;
  file: UploadedFile;
}

const Uploading = ({ title, file }: UploadingProps) => {
  const t = useT();
  const { format } = useFileSize();

  return (
    <FileCardContent
      title={title}
      subtitle={`${format(file.size)} • ${t("Uploading document ...")}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-primary-50"
    />
  );
};

interface UploadedProps extends UploadingProps {
  showPrivateCheckbox?: boolean;
  onPrivateChange: (checked: boolean) => void;
}

const Uploaded = ({ title, file, showPrivateCheckbox, onPrivateChange }: UploadedProps) => {
  const t = useT();
  const { format } = useFileSize();

  return (
    <FileCardContent
      title={title}
      subtitle={`${format(file.size)} • ${t("Document Uploaded")}`}
      file={file}
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
}

const Failed = ({ title, errorMessage }: FailedContentProps) => {
  const t = useT();

  return (
    <FileCardContent
      title={title}
      errorMessage={`${errorMessage} • ${t("Upload Failed")}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-primary-50"
    />
  );
};

export default FilePreviewCard;
