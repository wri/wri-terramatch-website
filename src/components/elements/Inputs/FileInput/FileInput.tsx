import { useT } from "@transifex/react";
import classNames from "classnames";
import { ChangeEvent, Fragment, useId, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";

import { FileCardContent } from "@/components/elements/Inputs/FileInput/FileCardContent";
import List from "@/components/extensive/List/List";
import { APIError } from "@/generated/apiFetcher";
import { FileType, UploadedFile } from "@/types/common";

import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";
import FilePreviewCard from "./FilePreviewCard";

export type FileInputProps = InputWrapperProps & {
  accept?: FileType[];
  files: Partial<UploadedFile>[];

  allowMultiple?: boolean;
  maxFileSize?: number; // in MB
  showPrivateCheckbox?: boolean;

  onChange?: (file: File[]) => any;
  onDelete?: (file: Partial<UploadedFile>) => void;
  onPrivateChange?: (uuid: Partial<UploadedFile>, checked: boolean) => void;
};

export interface FileStatus {
  rawFile?: File;

  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: APIError;
}

/**
 * Notice: Please use RHFFileInput with React Hook Form
 * @param props FileInputProps
 * @returns FileInput component
 */
const FileInput = (props: FileInputProps) => {
  const id = useId();
  const t = useT();

  const ref = useRef<HTMLInputElement>(null);

  const accept = props.accept?.join(",");

  const labelText = useMemo(() => {
    const fileTypesLabel = [
      ["csv", t("CSV")],
      ["xlsx", t("Excel")],
      ["pdf", t("PDF")],
      ["image", t("PNG")],
      ["jpeg", t("JPEG")],
      ["video", t("Video")]
    ];

    let output = [];

    if (accept) {
      const formats = fileTypesLabel.filter(([key]) => accept?.includes(key)).map(([, label]) => label);

      if (formats.length > 1) {
        output.push(t("File formats: {formats}", { formats: formats.join(", ") }));
      } else if (formats.length > 0) {
        output.push(t("File format: {formats}", { formats: formats.join(", ") }));
      }
    }
    const maxFileSizeInfo = props.maxFileSize ? t(" max. {max}MB", { max: props.maxFileSize }) : "";

    if (output.length > 0)
      return t("Upload File {additionalInfo}", { additionalInfo: `(${output.join(", ") + maxFileSizeInfo})` });
    else return "Upload File";
  }, [t, accept, props.maxFileSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => {
      props.onChange?.(files);
    }
  });

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (file) {
      props.onChange?.(Array.from(file));
    }
  };

  return (
    <Fragment>
      <InputWrapper
        inputId={id}
        label={props.label}
        description={props.description}
        containerClassName={props.containerClassName}
        required={props.required}
        error={!props.files || props.files.length === 0 ? props.error : undefined}
        feedbackRequired={props.feedbackRequired}
      >
        <div
          {...getRootProps()}
          className={classNames(
            "border-dashed-2 relative cursor-pointer rounded-xl p-10",
            isDragActive ? "bg-primary-100" : "bg-white"
          )}
          onClick={() => ref.current?.click()}
        >
          <input
            {...getInputProps()}
            id={id}
            ref={ref}
            type="file"
            hidden
            onChange={onSelectFile}
            multiple={props.allowMultiple}
            accept={accept}
          />
          <div className="m-auto flex w-fit items-center justify-center gap-3">
            <FileCardContent
              title={labelText}
              subtitle={`${t("Drag and drop or")} <span className="text-primary underline">${t(
                "browse your device"
              )}</span>`}
              thumbnailClassName="fill-primary"
              thumbnailContainerClassName="bg-primary-100"
            />
          </div>
        </div>
      </InputWrapper>
      <List
        as="div"
        itemAs={Fragment}
        className="mt-8 flex flex-col items-center justify-center gap-8"
        items={props.files}
        render={item => (
          <FilePreviewCard
            file={item}
            onDelete={file => props.onDelete?.(file)}
            onPrivateChange={props.onPrivateChange}
            showPrivateCheckbox={props.showPrivateCheckbox}
            className="w-[400px]"
          />
        )}
      />
    </Fragment>
  );
};

export default FileInput;
