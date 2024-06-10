import { remove } from "lodash";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import {
  FileInputVariant,
  VARIANT_FILE_INPUT_MODAL_ADD
} from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Status, { StatusEnum } from "@/components/elements/Status/Status";
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
  acceptedTYpes?: FileType[];
  status?: "under-review" | "approved" | "draft" | "submitted";
  onClose?: () => void;
  setFile?: (file: UploadedFile[]) => void;
}

const ModalAdd: FC<ModalAddProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  descriptionInput,
  descriptionList,
  descriptionListStatus,
  acceptedTYpes,
  variantFileInput = VARIANT_FILE_INPUT_MODAL_ADD,
  children,
  status,
  setFile,
  onClose,
  ...rest
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (setFile && files) {
      setFile(files);
    }
  }, [files, setFile]);

  return (
    <ModalAddBase {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <div className="flex items-center">
          <When condition={status}>
            <Status
              status={(status ?? "draft") as StatusEnum}
              className="rounded px-2 py-[2px]"
              textVariant="text-14-bold"
            />
          </When>
          <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
            <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
          </button>
        </div>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <When condition={!!iconProps}>
          <Icon
            {...iconProps!}
            width={iconProps?.width ?? 40}
            className={twMerge("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
          />
        </When>
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
        </div>
        <When condition={!!content}>
          <Text variant="text-12-light" className="mt-1 mb-4">
            {content}
          </Text>
        </When>
        <FileInput
          descriptionInput={descriptionInput}
          descriptionList={descriptionList}
          descriptionListStatus={descriptionListStatus}
          variant={variantFileInput}
          accept={acceptedTYpes}
          onDelete={file =>
            setFiles(state => {
              const tmp = [...state];
              remove(tmp, f => f.uuid === file.uuid);
              return tmp;
            })
          }
          onChange={files =>
            setFiles(f => [
              ...f,
              ...files.map(file => ({
                title: file.name,
                file_name: file.name,
                mime_type: file.type,
                collection_name: "storybook",
                size: file.size,
                url: "https://google.com",
                created_at: "now",
                uuid: file.name,
                is_public: true,
                rawFile: file
              }))
            ])
          }
          files={files}
        />
        {children}
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        </When>
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
