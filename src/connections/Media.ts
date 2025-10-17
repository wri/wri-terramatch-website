import exifr from "exifr";

import {
  uploadFile,
  UploadFileError,
  UploadFileResponse,
  UploadFileVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import { ExtraMediaRequest } from "@/generated/v3/entityService/entityServiceSchemas";
import { mediaToUploadedFile, UploadedFile } from "@/types/common";
import Log from "@/utils/log";
import { parallelRequestHook, RequestOptions } from "@/utils/parallelRequestHook";

export const prepareFileForUpload = async (file: File, isPublic = true): Promise<ExtraMediaRequest> => {
  try {
    const location = await exifr.gps(file);
    const { latitude, longitude } = location ?? { latitude: 0, longitude: 0 };

    const formData = new FormData();
    formData.append("uploadFile", file);

    return { isPublic, lat: latitude, lng: longitude, formData };
  } catch (e) {
    Log.error("Error decoding EXIF data", e);
    throw e;
  }
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
  isMultipart: true,
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
