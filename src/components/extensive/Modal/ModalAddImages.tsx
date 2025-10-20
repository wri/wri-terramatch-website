import { useT } from "@transifex/react";
import React, { FC, ReactNode, useCallback, useEffect } from "react";
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
import { fileUploadOptions, prepareFileForUpload, useUploadFile } from "@/connections/Media";
import { DeleteV2FilesUUIDResponse, useDeleteV2FilesUUID } from "@/generated/apiComponents";
import { UploadFilePathParams } from "@/generated/v3/entityService/entityServiceComponents";
import { useFiles } from "@/hooks/useFiles";
import { FileType, UploadedFile } from "@/types/common";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalAddBase } from "./ModalsBases";

export type FileUploadEntity = UploadFilePathParams["entity"];

interface ModalAddImageProps extends ModalProps {
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
  entity: FileUploadEntity;
  collection: string;
  entityData: any;
}

const ModalAddImages: FC<ModalAddImageProps> = ({
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
  entity,
  collection,
  entityData,
  ...rest
}) => {
  const t = useT();
  const uploadFile = useUploadFile({ pathParams: { entity, collection, uuid: entityData.uuid } });
  const { files, addFile, removeFile, updateFile } = useFiles(allowMultiple ?? false);

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess(data) {
      removeFile((data as { data: DeleteV2FilesUUIDResponse }).data);
    },
    onError(err) {
      setErrorMessage?.(`Error deleting file: ${err}`);
    }
  });

  useEffect(() => {
    if (setFile) {
      setFile(files);
    }
  }, [files, setFile]);

  const handleDeleteFile = useCallback(
    (file: Partial<UploadedFile>) => {
      if (file.uuid) {
        addFile({
          ...file,
          uploadState: {
            isLoading: false,
            isSuccess: false,
            isDeleting: true
          }
        });
        deleteFile({ pathParams: { uuid: file.uuid } });
      } else {
        removeFile(file);
      }
    },
    [addFile, deleteFile, removeFile]
  );

  const handleFileChange = useCallback(
    async (newFiles: File[]) => {
      const acceptedFileTypes = (acceptedTypes ?? []).map(type => `${type}`.trim());

      for (const file of newFiles) {
        if (
          acceptedFileTypes.length > 0 &&
          !acceptedFileTypes.some(type => file.type === type || file.name.endsWith(type))
        ) {
          setErrorMessage?.(t(`Unsupported file type. Please upload files of type: ${acceptedFileTypes.join(", ")}`));
          continue;
        }
        if (file.size > maxFileSize) {
          setErrorMessage?.(t(`File size exceeds the limit of ${maxFileSize / 1048576} MB`));
          continue;
        }

        addFile({
          collectionName: collection,
          size: file.size,
          fileName: file.name,
          mimeType: file.type,
          rawFile: file,
          uploadState: {
            isLoading: true
          }
        });

        uploadFile(
          await prepareFileForUpload(file),
          fileUploadOptions(file, collection, { onSuccess: addFile, onError: addFile })
        );
      }
    },
    [acceptedTypes, addFile, collection, maxFileSize, setErrorMessage, t, uploadFile]
  );

  const deleteAllFiles = useCallback(() => {
    files.forEach(file => {
      if (file.uuid) {
        deleteFile({ pathParams: { uuid: file.uuid } });
      }
    });
  }, [files, deleteFile]);

  const handleClose = useCallback(() => {
    deleteAllFiles();
    onClose?.();
  }, [deleteAllFiles, onClose]);

  return (
    <ModalAddBase {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <div className="flex items-center">
          {status == null ? null : (
            <Status status={status} className="rounded px-2 py-[2px]" textVariant="text-14-bold" />
          )}
          <button onClick={handleClose} className="ml-2 rounded p-1 hover:bg-grey-800">
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
            {t("Download")}
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
          onDelete={handleDeleteFile}
          onChange={handleFileChange}
          files={files}
          allowMultiple={allowMultiple}
          updateFile={updateFile}
          entityData={entityData}
        />
        {children}
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        {secondaryButtonProps == null ? null : (
          <Button {...secondaryButtonProps} variant="white-page-admin">
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

export default ModalAddImages;
