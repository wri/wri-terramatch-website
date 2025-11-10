import { useT } from "@transifex/react";
import { useCallback, useEffect, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FileUploadEntity } from "@/components/extensive/Modal/ModalAddImages";
import { deleteMedia } from "@/connections/Media";
import { fileUploadOptions, prepareFileForUpload, useUploadFile } from "@/connections/Media";
import { FormModelType } from "@/connections/util/Form";
import { useFormModelUuid } from "@/context/wizardForm.provider";
import { usePutV2FilesUUID } from "@/generated/apiComponents";
import { isTranslatableError } from "@/generated/v3/utils";
import { v3EntityName } from "@/helpers/entity";
import { useFiles } from "@/hooks/useFiles";
import { EntityName, UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";
import { getErrorMessages } from "@/utils/errors";
import Log from "@/utils/log";

import FileInput, { FileInputProps } from "./FileInput";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP } from "./FileInputVariants";

export interface RHFFileInputProps
  extends Omit<FileInputProps, "files" | "loading" | "onChange" | "onDelete">,
    UseControllerProps {
  collection: string;
  formHook?: UseFormReturn;
  showPrivateCheckbox?: boolean;
  onChangeCapture?: () => void;
  isPhotosAndVideo?: boolean;
  model: FormModelType;
}

// TODO (NJC): TM-2581 will get these values from v3 and this will no longer be needed
export const normalizeV2UploadedFiles = (value: any): UploadedFile[] =>
  toArray(value).map(
    value =>
      ({
        ...value,
        thumbUrl: value.thumbUrl ?? value.thumb_url,
        fileName: value.fileName ?? value.file_name,
        mimeType: value.mimeType ?? value.mime_type,
        createdAt: value.createdAt ?? value.created_at,
        collectionName: value.collectionName ?? value.collection_name,
        isPublic: value.isPublic ?? value.is_public,
        isCover: value.isCover ?? value.is_cover
      } as UploadedFile)
  );

/**
 * @param props RHFFileInputProps
 * @returns React Hook Form Ready File Input Component
 */
const RHFFileInput = ({
  formHook,
  model,
  collection,
  showPrivateCheckbox,
  onChangeCapture,
  isPhotosAndVideo = false,
  ...fileInputProps
}: RHFFileInputProps) => {
  const t = useT();
  const uuid = useFormModelUuid(model);
  const { field } = useController(fileInputProps);
  const onChange = field.onChange;
  const { files, addFile, removeFile, updateFile } = useFiles(
    fileInputProps.allowMultiple ?? false,
    normalizeV2UploadedFiles(field.value)
  );
  const entity = v3EntityName(model as EntityName) as FileUploadEntity;
  if (uuid == null) {
    Log.error("Missing a model UUID for this file input", { model, collection });
  }
  const uploadFile = useUploadFile({ pathParams: { entity, collection, uuid: uuid ?? "" } });

  const { mutate: update } = usePutV2FilesUUID();

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
          onError: removeFile,
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
      removeFile,
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
    async (file: Partial<UploadedFile>) => {
      if (file.uuid) {
        addFile({
          ...file,
          uploadState: {
            isLoading: false,
            isSuccess: false,
            isDeleting: true
          }
        });
        await deleteMedia(file.uuid);
        removeFile(file);
        onChangeCapture?.();
      } else if (file.fileName != null) {
        removeFile(file);
      }
    },
    [addFile, removeFile, onChangeCapture]
  );

  useEffect(() => {
    const tmp = toArray(files)
      // Only store uploaded files into form state.
      .filter(file => file.uuid != null);

    onChange(fileInputProps.allowMultiple ? tmp : tmp?.[0]);
  }, [onChange, files, fileInputProps.allowMultiple]);

  const entityData = useMemo(() => ({ model, collection, uuid }), [collection, model, uuid]);
  const _onChange = useCallback((files: File[]) => files.forEach(onSelectFile), [onSelectFile]);

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
      onChange={_onChange}
      onPrivateChange={handleFileUpdate}
      showPrivateCheckbox={showPrivateCheckbox}
      formHook={formHook}
      updateFile={updateFile}
      entityData={entityData}
    />
  );
};

export default RHFFileInput;
