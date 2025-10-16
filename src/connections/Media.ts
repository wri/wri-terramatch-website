import { mediaDelete } from "@/generated/v3/entityService/entityServiceComponents";

import { deleterAsync } from "./util/resourceDeleter";

const createEntityDeleter = () => deleterAsync("media", mediaDelete, uuid => ({ pathParams: { uuid: uuid } }));

export const deleteMedia = createEntityDeleter();
