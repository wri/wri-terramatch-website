import { createSelector } from "reselect";

import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { uploadFileFetchFailed, uploadFileIsFetching } from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, StoreResource } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

const fileUploadSelector = (entity: MediaOwnerType, uuid: string, collection: string) => (store: ApiDataStore) =>
    entity == null || uuid == null ? undefined : store.uploadFile?.[`${entity}|${uuid}|${collection}`];

type MediaOwnerType = "projects"
    | "sites"
    | "nurseries"
    | "projectReports"
    | "siteReports"
    | "nurseryReports"
    | "organisations"
    | "auditStatuses"
    | "forms"
    | "formQuestionOptions";

type FileUploadProps = {
    entity: MediaOwnerType;
    uuid: string;
    collection: string;
}

export type FileUploadConnection = {
    fileUpload: StoreResource<MediaDto> | undefined;
    fileUploadLoadFailed: boolean;
    fileUploadIsFetching: boolean;
    uploadFile: (file: File) => void;
}

const fileUploadLoadFailed = (entity: MediaOwnerType, uuid: string, collection: string) => (store: ApiDataStore) =>
    entity == null || uuid == null ? false : uploadFileFetchFailed({ pathParams: { entity, uuid, collection } })(store) != null;

const fileUploadIsFetching = (entity: MediaOwnerType, uuid: string, collection: string) => (store: ApiDataStore) =>
    entity == null || uuid == null ? false : uploadFileIsFetching({ pathParams: { entity, uuid, collection } })(store) != null;

const connectionIsLoaded = (
    { fileUpload, fileUploadLoadFailed, fileUploadIsFetching }: FileUploadConnection,
    { entity, uuid, collection }: FileUploadProps
) =>
    entity == null || uuid == null || collection == null || fileUpload == null || fileUploadLoadFailed || fileUploadIsFetching
        ? false
        : true;

const fileUploadConnection: Connection<FileUploadConnection, FileUploadProps> = {
    load: (connection, props) => {
        if (!connectionIsLoaded(connection, props)) {
            
        }
    },
    isLoaded: connectionIsLoaded,
    selector: selectorCache(
        props => `${props.entity}|${props.uuid}|${props.collection}`,
        props => createSelector(
            [
                fileUploadSelector(props.entity, props.uuid, props.collection),
                fileUploadLoadFailed(props.entity, props.uuid, props.collection),
                fileUploadIsFetching(props.entity, props.uuid, props.collection)
            ],
            (fileUpload, fileUploadLoadFailed, fileUploadIsFetching) => ({
                fileUpload,
                fileUploadLoadFailed,
                fileUploadIsFetching,
                uploadFile: (file: File) => uploadFile({
                    pathParams: { entity: props.entity, uuid: props.uuid, collection: props.collection },
                    //@ts-ignore swagger issue
                    body: {
                        data: {
                            type: "uploadFile",
                        }
                    }
                })
            })
        )
    )
}

export const useFileUpload = connectionHook(fileUploadConnection);
