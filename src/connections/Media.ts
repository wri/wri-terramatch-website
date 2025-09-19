import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import { uploadFile, UploadFilePathParams } from "@/generated/v3/entityService/entityServiceComponents";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

export const selectUploadFile = (store: ApiDataStore) => store.media;

type UploadFileConnection = {
  isLoading: boolean;
  uploadFailed: PendingError | undefined;
  isSuccess: boolean;
  uploadFile: (formData: FormData) => void;
  clearPending: () => void;
};
const uploadFileConnection: Connection<UploadFileConnection, UploadFilePathParams> = {
  selector: selectorCache(
    ({ entity, uuid, collection }) => `${entity}/${uuid}/${collection}`,
    ({ entity, uuid, collection }) =>
      createSelector(
        [
          uploadFile.isFetchingSelector({ pathParams: { entity, uuid, collection } }),
          uploadFile.fetchFailedSelector({ pathParams: { entity, uuid, collection } }),
          selectUploadFile
        ],
        (isLoading, uploadFailed, selector) => {
          return {
            isLoading: isLoading,
            uploadFailed: uploadFailed,
            isSuccess: selector?.uuid != null,
            uploadFile: (formData: FormData) => {
              console.log("uploadFile", formData);
              uploadFile.fetch(
                {
                  // @ts-ignore swagger issue
                  body: formData,
                  pathParams: { entity, uuid, collection }
                },
                {
                  "Content-Type": "multipart/form-data"
                }
              );
            },
            clearPending: () => {
              uploadFile.clearPending({ pathParams: { entity, uuid, collection } });
            }
          };
        }
      )
  )
};
export const useUploadFile = connectionHook(uploadFileConnection);
