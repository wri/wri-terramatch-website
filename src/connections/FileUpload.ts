import { createSelector } from "reselect";

import { uploadFile, UploadFilePathParams } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { uploadFileFetchFailed, uploadFileIsFetching } from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, StoreResource } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

const fileUploadSelector = (entity: MediaOwnerType, uuid: string, collection: string) => (store: ApiDataStore) =>
  entity == null || uuid == null ? undefined : store.media?.[`${entity}|${uuid}|${collection}`];

// Use the same type as defined in the generated API components
export type MediaOwnerType = UploadFilePathParams["entity"];

type FileUploadProps = {
  entity: MediaOwnerType;
  uuid: string;
  collection: string;
};

export type FileUploadConnection = {
  fileUpload: StoreResource<MediaDto> | undefined;
  fileUploadLoadFailed: boolean;
  fileUploadIsFetching: boolean;
  uploadFile: (file: File, additionalData?: FormData) => void;
};

const fileUploadLoadFailed = (entity: MediaOwnerType, uuid: string, collection: string) => (store: ApiDataStore) =>
  entity == null || uuid == null
    ? false
    : uploadFileFetchFailed({ pathParams: { entity, uuid, collection } })(store) != null;

const fileUploadIsFetching = (entity: MediaOwnerType, uuid: string, collection: string) => (store: ApiDataStore) =>
  entity == null || uuid == null
    ? false
    : uploadFileIsFetching({ pathParams: { entity, uuid, collection } })(store) != null;

const connectionIsLoaded = (
  { fileUpload, fileUploadLoadFailed, fileUploadIsFetching }: FileUploadConnection,
  { entity, uuid, collection }: FileUploadProps
) =>
  entity == null ||
  uuid == null ||
  collection == null ||
  fileUpload == null ||
  fileUploadLoadFailed ||
  fileUploadIsFetching
    ? false
    : true;

const fileUploadConnection: Connection<FileUploadConnection, FileUploadProps> = {
  load: (connection, props) => {
    if (!connectionIsLoaded(connection, props)) {
      // Connection loading logic can be implemented here if needed
      // For file uploads, we typically don't need to pre-load anything
    }
  },
  isLoaded: connectionIsLoaded,
  selector: selectorCache(
    props => `${props.entity}|${props.uuid}|${props.collection}`,
    props =>
      createSelector(
        [
          fileUploadSelector(props.entity, props.uuid, props.collection),
          fileUploadLoadFailed(props.entity, props.uuid, props.collection),
          fileUploadIsFetching(props.entity, props.uuid, props.collection)
        ],
        (fileUpload, fileUploadLoadFailed, fileUploadIsFetching) => ({
          fileUpload,
          fileUploadLoadFailed,
          fileUploadIsFetching,
          uploadFile: (file: File, additionalData?: FormData) => {
            const body = additionalData || new FormData();
            if (!additionalData) {
              body.append("upload_file", file);
            }

            uploadFile({
              pathParams: { entity: props.entity, uuid: props.uuid, collection: props.collection },
              //@ts-ignore swagger issue
              body
            });
          }
        })
      )
  )
};

export const useFileUpload = connectionHook(fileUploadConnection);
