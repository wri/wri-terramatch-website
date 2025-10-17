import { useT } from "@transifex/react";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FileUploadEntity } from "@/components/extensive/Modal/ModalAddImages";
import { fileUploadOptions, prepareFileForUpload, useUploadFile } from "@/connections/Media";
import { useDeleteV2FilesUUID, usePutV2FilesUUID } from "@/generated/apiComponents";
import { isTranslatableError } from "@/generated/v3/utils";
import { v3EntityName } from "@/helpers/entity";
import { EntityName, UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";
import { getErrorMessages } from "@/utils/errors";

import FileInput, { FileInputProps } from "./FileInput";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP } from "./FileInputVariants";

export interface RHFFileInputProps
  extends Omit<FileInputProps, "files" | "loading" | "onChange" | "onDelete">,
    UseControllerProps {
  model: string;
  collection: string;
  uuid: string;
  formHook?: UseFormReturn;
  showPrivateCheckbox?: boolean;
  onChangeCapture?: () => void;
  isPhotosAndVideo?: boolean;
}

/**
 * @param props RHFFileInputProps
 * @returns React Hook Form Ready File Input Component
 */
const RHFFileInput = ({
  formHook,
  model,
  collection,
  uuid,
  showPrivateCheckbox,
  onChangeCapture,
  isPhotosAndVideo = false,
  ...fileInputProps
}: RHFFileInputProps) => {
  const t = useT();

  const { field } = useController(fileInputProps);
  const value = field.value as UploadedFile | UploadedFile[];
  const onChange = field.onChange;
  const [files, setFiles] = useState<Partial<UploadedFile>[]>(toArray(value));
  const entity = v3EntityName(model as EntityName) as FileUploadEntity;
  const uploadFile = useUploadFile({ pathParams: { entity, collection, uuid } });

  const { mutate: update } = usePutV2FilesUUID();

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess(data) {
      //@ts-ignore swagger issue
      removeFileFromValue(data.data);
      onChangeCapture?.();
    }
  });

  const addFileToValue = useCallback(
    (file: Partial<UploadedFile>) => {
      setFiles(value => {
        if (Array.isArray(value) && fileInputProps.allowMultiple) {
          const tmp = [...value];

          const index = tmp.findIndex(item => {
            if (!!file.uuid && file.uuid === item.uuid) {
              return true;
            } else if (!!file.rawFile && item.rawFile === file.rawFile) {
              return true;
            } else {
              return false;
            }
          });

          if (index === -1) {
            return [...tmp, file];
          } else {
            tmp.splice(index, 1, file);

            return tmp;
          }
        } else {
          return [file];
        }
      });
    },
    [fileInputProps.allowMultiple]
  );

  const removeFileFromValue = useCallback((file: Partial<UploadedFile>) => {
    setFiles(value => {
      if (Array.isArray(value)) {
        const tmp = [...value];
        if (file.uuid) {
          _.remove(tmp, v => v.uuid === file.uuid);
        } else {
          _.remove(tmp, v => v.fileName === file.fileName);
        }
        return tmp;
      } else {
        return [];
      }
    });
  }, []);

  const onSelectFile = useCallback(
    async (file: File) => {
      const maxSize = fileInputProps.maxFileSize;

      if (maxSize && file.size > maxSize * 1024 * 1024) {
        const error = getErrorMessages(t, "UPLOAD_ERROR", { max: maxSize });
        formHook?.setError(fileInputProps.name, error);

        addFileToValue({
          collectionName: collection,
          size: file.size,
          fileName: file.name,
          mimeType: file.type,
          rawFile: file,
          uploadState: {
            isLoading: false,
            isSuccess: false,
            error: error.message
          }
        });
        return;
      }

      addFileToValue({
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
        fileUploadOptions(file, collection, addFileToValue, error => {
          if (isTranslatableError(error)) {
            const formError = getErrorMessages(t, error.code, { ...error.variables, label: fileInputProps.label });
            formHook?.setError(fileInputProps.name, formError);
            return formError.message;
          } else {
            const errorMessage = t(
              "UPLOAD ERROR: An error occurred during upload. Please try again or upload a smaller file."
            );
            formHook?.setError(fileInputProps.name, { type: "manual", message: errorMessage });
            return errorMessage;
          }
        })
      );

      formHook?.clearErrors(fileInputProps.name);
    },
    [
      addFileToValue,
      collection,
      fileInputProps.label,
      fileInputProps.maxFileSize,
      fileInputProps.name,
      formHook,
      t,
      uploadFile
    ]
  );

  const handleFileUpdate = useCallback(
    (file: Partial<UploadedFile>, isPrivate: boolean) => {
      if (file.uuid == null) return;

      update({
        pathParams: {
          uuid: file.uuid
        },
        body: {
          title: file.fileName ?? "",
          is_public: !isPrivate
        }
      });
    },
    [update]
  );

  const onDeleteFile = useCallback(
    (file: Partial<UploadedFile>) => {
      if (file.uuid) {
        addFileToValue({
          ...file,
          uploadState: {
            isLoading: false,
            isSuccess: false,
            isDeleting: true
          }
        });
        deleteFile({ pathParams: { uuid: file.uuid } });
      } else if (file.fileName) {
        removeFileFromValue(file);
      }
    },
    [addFileToValue, deleteFile, removeFileFromValue]
  );

  const updateFileInValue = useCallback((updatedFile: Partial<UploadedFile>) => {
    setFiles(prevFiles => prevFiles.map(file => (file.uuid === updatedFile.uuid ? { ...file, ...updatedFile } : file)));
  }, []);

  useEffect(() => {
    const tmp = toArray(files)
      //Only store uploaded files into form state.
      .filter(file => !!file.uuid);

    onChange(fileInputProps.allowMultiple ? tmp : tmp?.[0]);
  }, [onChange, files, fileInputProps.allowMultiple]);

  return (
    <FileInput
      {...fileInputProps}
      files={files}
      {...(isPhotosAndVideo && {
        previewAsTable: true,
        descriptionInput: t("drag and drop or browse your device"),
        variant: VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP
      })}
      onDelete={onDeleteFile}
      onChange={files => files.forEach(onSelectFile)}
      onPrivateChange={handleFileUpdate}
      showPrivateCheckbox={showPrivateCheckbox}
      formHook={formHook}
      updateFile={updateFileInValue}
      entityData={{ model, collection, uuid }}
    />
  );
};

export default RHFFileInput;
