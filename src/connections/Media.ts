import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import { mediaUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3Resource } from "./util/apiConnectionFactory";

export const uploadFileConnection = v3Resource("media", mediaUpdate)
  .singleResource<MediaDto>(({ id }) => ({ pathParams: { uuid: id! } }))
  .update(mediaUpdate)
  .buildConnection();

export const useUploadFile = connectionHook(uploadFileConnection);
export const selectUploadFile = connectionSelector(uploadFileConnection);
