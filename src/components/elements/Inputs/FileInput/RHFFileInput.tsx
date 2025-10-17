import { useT } from "@transifex/react";
import { useCallback, useEffect } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FileUploadEntity } from "@/components/extensive/Modal/ModalAddImages";
import { fileUploadOptions, prepareFileForUpload, useUploadFile } from "@/connections/Media";
import { DeleteV2FilesUUIDResponse, useDeleteV2FilesUUID, usePutV2FilesUUID } from "@/generated/apiComponents";
import { isTranslatableError } from "@/generated/v3/utils";
import { v3EntityName } from "@/helpers/entity";
import { useFiles } from "@/hooks/useFiles";
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
  const { files, addFile, removeFile, updateFile } = useFiles(fileInputProps.allowMultiple ?? false, toArray(value));
  const entity = v3EntityName(model as EntityName) as FileUploadEntity;
  const uploadFile = useUploadFile({ pathParams: { entity, collection, uuid } });

  const { mutate: update } = usePutV2FilesUUID();

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess(data) {
      removeFile((data as { data: DeleteV2FilesUUIDResponse }).data);
      onChangeCapture?.();
    }
  });

  const onSelectFile = useCallback(
    async (file: File) => {
      const maxSize = fileInputProps.maxFileSize;

      if (maxSize && file.size > maxSize * 1024 * 1024) {
        const error = getErrorMessages(t, "UPLOAD_ERROR", { max: maxSize });
        formHook?.setError(fileInputProps.name, error);

        addFile({
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
        fileUploadOptions(file, collection, {
          onSuccess: addFile,
          onError: addFile,
          getErrorMessage: error => {
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
          }
        })
      );

      formHook?.clearErrors(fileInputProps.name);
    },
    [
      addFile,
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
        addFile({
          ...file,
          uploadState: {
            isLoading: false,
            isSuccess: false,
            isDeleting: true
          }
        });
        deleteFile({ pathParams: { uuid: file.uuid } });
      } else if (file.fileName != null) {
        removeFile(file);
      }
    },
    [addFile, deleteFile, removeFile]
  );

  useEffect(() => {
    const tmp = toArray(files)
      // Only store uploaded files into form state.
      .filter(file => file.uuid != null);

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
      updateFile={updateFile}
      entityData={{ model, collection, uuid }}
    />
  );
};

export default RHFFileInput;
