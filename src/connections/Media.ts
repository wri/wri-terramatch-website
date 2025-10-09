import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import { mediaUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { v3Resource } from "./util/apiConnectionFactory";

export const mediaConnection = v3Resource("media")
  .singleResource<MediaDto>(({ id }) => ({ pathParams: { uuid: id! } }))
  .update(mediaUpdate)
  .buildConnection();

export const useMedia = connectionHook(mediaConnection);
export const selectMedia = connectionSelector(mediaConnection);
