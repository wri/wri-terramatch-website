import { remove } from "lodash";
import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import {
  FileInputVariant,
  VARIANT_FILE_INPUT_MODAL_ADD
} from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { FileType, UploadedFile } from "@/types/common";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalAddBase } from "./ModalsBases";

export interface ModalAddProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  descriptionInput?: string;
  descriptionList?: ReactNode;
  variantFileInput?: FileInputVariant;
  descriptionListStatus?: string;
  acceptedTypes?: FileType[];
  status?: StatusEnum;
  maxFileSize?: number;
  onClose?: () => void;
  setFile?: (file: UploadedFile[]) => void;
  allowMultiple?: boolean;
  btnDownload?: boolean;
  secondTitle?: string;
  secondContent?: string;
  btnDownloadProps?: IButtonProps;
  setErrorMessage?: (message: string) => void;
  previewAsTable?: boolean;
}

export const formatFile = (file: File): UploadedFile => ({
  fileName: file.name,
  mimeType: file.type,
  collectionName: "storybook",
  size: file.size,
  url: "https://google.com",
  createdAt: "now",
  uuid: file.name,
  isPublic: true,
  rawFile: file
});

const ModalAdd: FC<ModalAddProps> = ({
  iconProps,
  title,
  secondTitle,
  content,
  secondContent,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  descriptionInput,
  descriptionList,
  descriptionListStatus,
  acceptedTypes,
  maxFileSize = 10485760, // Default to 10MB
  variantFileInput = VARIANT_FILE_INPUT_MODAL_ADD,
  children,
  status,
  setFile,
  onClose,
  allowMultiple = true,
  btnDownload = false,
  btnDownloadProps,
  setErrorMessage,
  previewAsTable,
  ...rest
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (setFile && files) {
      setFile(files);
    }
  }, [files, setFile]);

  const handleFileChange = useCallback(
    (files: File[]) => {
      const acceptedFileTypes = (acceptedTypes ?? []).map(type => `${type}`.trim());

      const filteredFiles = files.filter(file => {
        if (
          acceptedFileTypes.length > 0 &&
          !acceptedFileTypes.some(type => file.type === type || file.name.endsWith(type))
        ) {
          setErrorMessage?.(`Unsupported file type. Please upload files of type: ${acceptedFileTypes.join(", ")}`);
          return false;
        }
        if (file.size > maxFileSize) {
          setErrorMessage?.(`File size exceeds the limit of ${maxFileSize / 1048576} MB`);
          return false;
        }
        return true;
      });

      if (filteredFiles.length > 0) {
        if (!allowMultiple) {
          const firstFile = filteredFiles[0];
          setFiles([formatFile(firstFile)]);
        } else {
          setFiles(prevFiles => [...prevFiles, ...filteredFiles.map(formatFile)]);
        }
      }
    },
    [acceptedTypes, allowMultiple, maxFileSize, setErrorMessage]
  );

  return (
    <ModalAddBase {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <div className="flex items-center">
          {status == null ? null : (
            <Status status={status} className="rounded px-2 py-[2px]" textVariant="text-14-bold" />
          )}
          <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
            <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
          </button>
        </div>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        {iconProps == null ? null : (
          <Icon
            {...iconProps}
            width={iconProps.width ?? 40}
            className={twMerge("mb-8", iconProps.className)}
            style={{ minHeight: iconProps.height ?? iconProps.width ?? 40 }}
          />
        )}
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
        </div>
        {content == null ? null : (
          <Text variant="text-12-light" className="mt-1 mb-4">
            {content}
          </Text>
        )}
        {!btnDownload ? null : (
          <Button
            variant="white-page-admin"
            className="mb-4 flex-1"
            iconProps={{
              className: "w-4 h-4 group-hover-text-primary-500",
              name: IconNames.DOWNLOAD_PA
            }}
            {...btnDownloadProps}
          >
            Download
          </Button>
        )}
        {secondTitle == null ? null : (
          <div className="flex items-center justify-between">
            <Text variant="text-24-bold">{secondTitle}</Text>
          </div>
        )}
        {secondContent == null ? null : (
          <Text variant="text-12-light" className="mt-1 mb-4">
            {secondContent}
          </Text>
        )}
        <FileInput
          previewAsTable={previewAsTable}
          descriptionInput={descriptionInput}
          descriptionList={descriptionList}
          descriptionListStatus={descriptionListStatus}
          variant={variantFileInput}
          accept={acceptedTypes}
          onDelete={file =>
            setFiles(state => {
              const tmp = [...state];
              remove(tmp, f => f.uuid === file.uuid);
              return tmp;
            })
          }
          onChange={handleFileChange}
          files={files}
          allowMultiple={allowMultiple}
        />
        {children}
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        {secondaryButtonProps == null ? null : (
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        )}
        <Button {...primaryButtonProps}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalAddBase>
  );
};

export default ModalAdd;
