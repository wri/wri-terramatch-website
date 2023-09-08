import { useT } from "@transifex/react";
import classNames from "classnames";
import Lottie from "lottie-react";
import prettyBytes from "pretty-bytes";
import { Else, If, Then, When } from "react-if";

import SpinnerLottie from "@/assets/animations/spinner.json";
import IconButton from "@/components/elements/IconButton/IconButton";
import { FileCardContent } from "@/components/elements/Inputs/FileInput/FileCardContent";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { UploadedFile } from "@/types/common";

export interface FilePreviewCardProps {
  file: Partial<UploadedFile>;
  onDelete?: (file: Partial<UploadedFile>) => void;
  className?: string;
}

const FilePreviewCard = (props: FilePreviewCardProps) => {
  const { file, className, onDelete } = props;

  return (
    <div
      className={classNames("flex w-full items-center justify-between gap-4 rounded-xl bg-white p-4 shadow", className)}
    >
      <div className="flex items-center justify-center gap-4">
        <When condition={file.uuid || file.uploadState?.isSuccess}>
          <Uploaded title={file?.title || file?.file_name || ""} file={file as UploadedFile} />
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

interface ContentProps {
  title: string;
  file: UploadedFile;
}

const Uploading = (props: ContentProps) => {
  const t = useT();

  return (
    <FileCardContent
      title={props.title}
      subtitle={`${prettyBytes(props.file.size)} • ${t("Uploading document ...")}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-primary-50"
    />
  );
};

const Uploaded = (props: ContentProps) => {
  const t = useT();

  return (
    <FileCardContent
      title={props.title}
      subtitle={`${prettyBytes(props.file.size)} • ${t("Document Uploaded")}`}
      file={props.file}
      thumbnailClassName="fill-white"
      thumbnailContainerClassName="bg-success"
    />
  );
};

interface FailedContentProps {
  title: string;
  errorMessage: string;
}

const Failed = (props: FailedContentProps) => {
  const t = useT();

  return (
    <FileCardContent
      title={props.title}
      errorMessage={`${props.errorMessage} • ${t("Upload Failed")}`}
      thumbnailClassName="fill-primary-200"
      thumbnailContainerClassName="bg-primary-50"
    />
  );
};

export default FilePreviewCard;
