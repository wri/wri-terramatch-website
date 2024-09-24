import { useT } from "@transifex/react";
import exifr from "exifr";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import {
  useDeleteV2FilesUUID,
  usePostV2FileUploadMODELCOLLECTIONUUID,
  usePutV2FilesUUID
} from "@/generated/apiComponents";
import { getCurrentPathEntity } from "@/helpers/entity";
import { UploadedFile } from "@/types/common";
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

  console.log("fileInputProps", fileInputProps);
  const { field } = useController(fileInputProps);
  console.log("fileInputProps", useController(fileInputProps), field);
  const value = field.value as UploadedFile | UploadedFile[];
  const onChange = field.onChange;
  const [files, setFiles] = useState<Partial<UploadedFile>[]>(toArray(value));
  const { mutate: upload } = usePostV2FileUploadMODELCOLLECTIONUUID({
    onSuccess(data, variables) {
      //@ts-ignore swagger issue
      addFileToValue({ ...data.data, rawFile: variables.file, uploadState: { isSuccess: true, isLoading: false } });
    },
    onError(err, variables: any) {
      if (err?.statusCode === 422 && Array.isArray(err?.errors)) {
        const error = err?.errors[0];
        const formError = getErrorMessages(t, error.code, { ...error.variables, label: fileInputProps.label });
        formHook?.setError(fileInputProps.name, formError);

        const file = variables.file;

        addFileToValue({
          collection_name: variables.pathParams.collection,
          size: file?.size,
          file_name: file?.name,
          title: file?.name,
          mime_type: file?.type,
          rawFile: file,
          uploadState: {
            isLoading: false,
            isSuccess: false,
            error: formError.message
          }
        });
      }
    }
  });

  const { mutate: update } = usePutV2FilesUUID();

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess(data) {
      //@ts-ignore swagger issue
      removeFileFromValue(data.data);
      onChangeCapture?.();
    }
  });

  const addFileToValue = (file: Partial<UploadedFile>) => {
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
  };

  const removeFileFromValue = (file: Partial<UploadedFile>) => {
    setFiles(value => {
      if (Array.isArray(value)) {
        const tmp = [...value];
        if (file.uuid) {
          _.remove(tmp, v => v.uuid === file.uuid);
        } else {
          _.remove(tmp, v => v.file_name === file.file_name);
        }
        return tmp;
      } else {
        return [];
      }
    });
  };

  const onSelectFile = async (file: File) => {
    const maxSize = fileInputProps.maxFileSize;

    if (maxSize && file.size > maxSize * 1024 * 1024) {
      const error = getErrorMessages(t, "UPLOAD_ERROR", { max: maxSize });
      formHook?.setError(fileInputProps.name, error);

      addFileToValue({
        collection_name: collection,
        size: file.size,
        file_name: file.name,
        title: file.name,
        mime_type: file.type,
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
      collection_name: collection,
      size: file.size,
      file_name: file.name,
      title: file.name,
      mime_type: file.type,
      rawFile: file,
      uploadState: {
        isLoading: true
      }
    });

    const body = new FormData();
    body.append("upload_file", file);

    try {
      const location = await exifr.gps(file);

      if (location) {
        body.append("lat", location.latitude.toString());
        body.append("lng", location.longitude.toString());
      }
    } catch (e) {
      console.log(e);
    }

    upload?.({
      pathParams: { model, collection, uuid },
      file: file,
      //@ts-ignore swagger issue
      body
    });
    formHook?.clearErrors(fileInputProps.name);
  };

  const handleFileUpdate = (file: Partial<UploadedFile>, isPrivate: boolean) => {
    if (!file.uuid || !file.title) return;

    update({
      pathParams: {
        uuid: file.uuid
      },
      body: {
        title: file.title,
        is_public: !isPrivate
      }
    });
  };

  const onDeleteFile = (file: Partial<UploadedFile>) => {
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
    } else if (file.file_name) {
      removeFileFromValue(file);
    }
  };

  useEffect(() => {
    const tmp = toArray(files)
      //Only store uploaded files into form state.
      .filter(file => !!file.uuid);

    onChange(fileInputProps.allowMultiple ? tmp : tmp?.[0]);
  }, [onChange, files, fileInputProps.allowMultiple]);

  return (
    <FileInput
      files={files}
      {...(isPhotosAndVideo && {
        previewAsTable: true,
        descriptionInput: "drag and drop or browse your device",
        description: `if operations have begun, please upload images or videos of this specific ${getCurrentPathEntity()}`,
        variant: VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP
      })}
      onDelete={onDeleteFile}
      onChange={files => files.forEach(onSelectFile)}
      onPrivateChange={handleFileUpdate}
      showPrivateCheckbox={showPrivateCheckbox}
      formHook={formHook}
    />
  );
};

export default RHFFileInput;
