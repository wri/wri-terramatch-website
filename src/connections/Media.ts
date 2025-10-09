import { mediaDelete, mediaGet } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3Resource } from "./util/apiConnectionFactory";
import { deleterAsync } from "./util/resourceDeleter";

export const mediaConnection = v3Resource("media", mediaGet)
  .singleResource<MediaDto>(({ id }) => ({ pathParams: { uuid: id! } }))
  .buildConnection();

const createEntityDeleter = () => deleterAsync("media", mediaDelete, uuid => ({ pathParams: { uuid: uuid } }));

export const deleteMedia = createEntityDeleter();
