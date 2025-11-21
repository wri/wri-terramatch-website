import exifr from "exifr";

import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  mediaDelete,
  mediaUpdate,
  uploadFile,
  UploadFileError,
  UploadFileResponse,
  UploadFileVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto, MediaRequestAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { WithFormData } from "@/generated/v3/utils";
import { mediaToUploadedFile, UploadedFile } from "@/types/common";
import Log from "@/utils/log";
import { parallelRequestHook, RequestOptions } from "@/utils/parallelRequestHook";
import { v3Resource } from "./util/apiConnectionFactory";
import { connectionHook } from "./util/connectionShortcuts";

export const mediaConnection = v3Resource("media")
  .singleResource<MediaDto>(({ id }) => ({ pathParams: { uuid: id! } }))
  .update(mediaUpdate)
  .buildConnection();

export const useMedia = connectionHook(mediaConnection);

export const deleteMedia = deleterAsync("media", mediaDelete, uuid => ({ pathParams: { uuid: uuid } }));

export const prepareFileForUpload = async (
  file: File,
  isPublic = true
): Promise<WithFormData<MediaRequestAttributes>> => {
  let location: Awaited<ReturnType<typeof exifr.gps>> | undefined = undefined;
  try {
    location = await exifr.gps(file);
  } catch (e) {
    // NOOP
  }

  const formData = new FormData();
  formData.append("uploadFile", file);
  const { latitude, longitude } = location ?? { latitude: null, longitude: null };
  return { isPublic, lat: latitude, lng: longitude, formData };
};

export const fileUploadOptions = (
  file: File,
  collection: string,
  {
    onSuccess,
    onError,
    getErrorMessage
  }: {
    onSuccess?: (successFile: Partial<UploadedFile>) => void;
    onError?: (errorFile: Partial<UploadedFile>, errorMessage: string) => void;
    getErrorMessage?: (error: UploadFileError) => string | undefined;
  } = {}
): RequestOptions<UploadFileResponse, UploadFileError, UploadFileVariables> => ({
  onSuccess: response => {
    if (response.data?.attributes == null) {
      Log.error("No media response from file upload", response);
    } else {
      onSuccess?.(mediaToUploadedFile(response.data.attributes, file, { isSuccess: true, isLoading: false }));
    }
  },
  onError: error => {
    Log.error("Error uploading file", error);
    const message = getErrorMessage?.(error) ?? error.message;
    onError?.(
      {
        collectionName: collection,
        size: file.size,
        fileName: file.name,
        mimeType: file.type,
        isCover: false,
        isPublic: true,
        rawFile: file,
        uploadState: { isLoading: false, isSuccess: false, error: message }
      },
      message
    );
  }
});

export const useUploadFile = parallelRequestHook("media", uploadFile);
