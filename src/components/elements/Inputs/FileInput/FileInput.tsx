import { useT } from "@transifex/react";
import classNames from "classnames";
import { ChangeEvent, FC, Fragment, ReactNode, useCallback, useId, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { twMerge as tw } from "tailwind-merge";

import { FileCardContent } from "@/components/elements/Inputs/FileInput/FileCardContent";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { FileType, UploadedFile } from "@/types/common";

import Text from "../../Text/Text";
import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";
import { FileInputVariant, VARIANT_FILE_INPUT_DEFAULT } from "./FileInputVariants";
import FilePreviewCard from "./FilePreviewCard";
import FilePreviewTable from "./FilePreviewTable";

export type FileInputProps = InputWrapperProps & {
  accept?: FileType[];
  files: Partial<UploadedFile>[];
  previewAsTable?: boolean;
  allowMultiple?: boolean;
  maxFileSize?: number; // in MB
  showPrivateCheckbox?: boolean;
  variant?: FileInputVariant;
  descriptionInput?: ReactNode;
  descriptionList?: ReactNode;
  descriptionListStatus?: string;
  onChange?: (file: File[]) => any;
  onDelete?: (file: Partial<UploadedFile>) => void;
  onPrivateChange?: (uuid: Partial<UploadedFile>, checked: boolean) => void;
  formHook?: UseFormReturn;
  updateFile?: (file: Partial<UploadedFile>) => void;
  entityData?: any;
  classNameTextOr?: string;
};

/**
 * Notice: Please use RHFFileInput with React Hook Form
 * @param props FileInputProps
 * @returns FileInput component
 */
const FileInput: FC<FileInputProps> = props => {
  const id = useId();
  const t = useT();

  const ref = useRef<HTMLInputElement>(null);

  const { variant = VARIANT_FILE_INPUT_DEFAULT } = props;

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
    else return t("Upload File");
  }, [t, accept, props.maxFileSize]);

  const { onChange } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => {
      onChange?.(files);
    }
  });

  const onSelectFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files;

      if (file) {
        onChange?.(Array.from(file));
      }
    },
    [onChange]
  );

  return (
    <>
      <InputWrapper
        inputId={id}
        label={props.label}
        description={props.description}
        containerClassName={props.containerClassName}
        required={props.required}
        error={!props.files || props.files.length === 0 ? props.error : undefined}
        feedbackRequired={props.feedbackRequired}
        labelClassName={props.labelClassName}
        labelVariant={props.labelVariant}
      >
        <div
          {...getRootProps()}
          className={tw(isDragActive ? "bg-primary-100" : "bg-white", variant.container)}
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
          {variant.snapshotPanel ? (
            <>
              <Icon name={IconNames.UPLOAD_CLOUD} className="mb-4 h-5 w-5" />
              <div className="flex flex-col">
                <Text variant="text-12-bold" className="text-center text-primary">
                  {t("Click to upload")}
                </Text>
                <Text variant="text-12-light" className={classNames("text-center", props.classNameTextOr)}>
                  {t("or")}
                </Text>
                {typeof props.descriptionInput === "string" ? (
                  <Text variant="text-12-light" className="max-w-[210px] text-center">
                    {props.descriptionInput}
                  </Text>
                ) : (
                  props.descriptionInput
                )}
              </div>
            </>
          ) : (
            <div className="m-auto flex w-fit items-center justify-center gap-3">
              <FileCardContent
                title={labelText}
                subtitle={t("Drag and drop or {browse}", {
                  browse: `<span class="underline text-primary">${t("browse your device")}</span>`
                })}
                thumbnailClassName="fill-primary"
                thumbnailContainerClassName="bg-primary-100"
              />
            </div>
          )}
        </div>
      </InputWrapper>
      {variant.listPreviewDescription == null ? null : (
        <div className={variant.listPreviewDescription}>
          {props.descriptionList}
          <Text variant="text-12-bold" className="mt-9 pr-5 text-primary">
            {t(props.descriptionListStatus)}
          </Text>
        </div>
      )}
      {props.previewAsTable ? (
        <FilePreviewTable
          items={props.files}
          onDelete={props.onDelete}
          onPrivateChange={props.onPrivateChange}
          formHook={props.formHook}
          updateFile={props.updateFile}
          entityData={props.entityData}
        />
      ) : (
        <List
          as="div"
          itemAs={Fragment}
          className={variant.listPreview}
          items={props.files}
          render={item => (
            <FilePreviewCard
              variant={variant.filePreviewVariant}
              file={item}
              onDelete={file => props.onDelete?.(file)}
              onPrivateChange={props.onPrivateChange}
              showPrivateCheckbox={props.showPrivateCheckbox}
            />
          )}
        />
      )}
    </>
  );
};

export default FileInput;
