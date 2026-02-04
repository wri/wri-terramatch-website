import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import {
  impactStoryBulkDelete as impactStoryBulkDeleteEndpoint,
  impactStoryCreate,
  impactStoryDelete,
  impactStoryGet,
  impactStoryIndex,
  ImpactStoryIndexQueryParams,
  impactStoryUpdate,
  ImpactStoryUpdateVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  ImpactStoryBulkDeleteBodyDto,
  ImpactStoryFullDto,
  ImpactStoryLightDto,
  StoreImpactStoryAttributes
} from "@/generated/v3/entityService/entityServiceSchemas";
import { resolveUrl } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";
import { Filter } from "@/types/connection";

const impactStoryConnection = v3Resource("impactStories", impactStoryGet)
  .singleFullResource<ImpactStoryFullDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .update<StoreImpactStoryAttributes, ImpactStoryUpdateVariables>(impactStoryUpdate)
  .buildConnection();

const impactStoriesConnection = v3Resource("impactStories", impactStoryIndex)
  .index<ImpactStoryLightDto>()
  .pagination()
  .filter<Filter<ImpactStoryIndexQueryParams>>()
  .buildConnection();

const createImpactStoryConnection = v3Resource("impactStories", impactStoryCreate)
  .create<ImpactStoryFullDto>()
  .buildConnection();

export const useImpactStory = connectionHook(impactStoryConnection);
export const useImpactStories = connectionHook(impactStoriesConnection);

export const loadImpactStory = connectionLoader(impactStoryConnection);
export const loadImpactStories = connectionLoader(impactStoriesConnection);

export const createImpactStory = resourceCreator(createImpactStoryConnection);
export const updateImpactStory = resourceUpdater(impactStoryConnection);
export const deleteImpactStory = deleterAsync("impactStories", impactStoryDelete, uuid => ({
  pathParams: { uuid }
}));

type ImpactStoryResourceIdentifier = {
  type: "impactStories";
  id: string;
};

const createBulkDeleteBody = (resources: ImpactStoryResourceIdentifier[]): ImpactStoryBulkDeleteBodyDto => {
  return {
    data: resources
  };
};

export const bulkDeleteImpactStories = async (uuids: string[]): Promise<void> => {
  const deleteResources: ImpactStoryResourceIdentifier[] = uuids.map(uuid => ({
    type: "impactStories",
    id: uuid
  }));

  const failureSelector = impactStoryBulkDeleteEndpoint.fetchFailedSelector({});
  const previousFailure = failureSelector(ApiSlice.currentState);
  if (previousFailure != null) {
    ApiSlice.clearPending(resolveUrl(impactStoryBulkDeleteEndpoint.url, {}), impactStoryBulkDeleteEndpoint.method);
  }

  const body = createBulkDeleteBody(deleteResources);
  impactStoryBulkDeleteEndpoint.fetch({ body });

  await new Promise<void>((resolve, reject) => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      const currentState = ApiSlice.currentState;
      const deleted = currentState.meta.deleted.impactStories ?? [];
      const allDeleted = uuids.every(uuid => deleted.includes(uuid));
      const failure = failureSelector(currentState);

      if (allDeleted) {
        unsubscribe();
        resolve();
      } else if (failure != null) {
        unsubscribe();
        reject(failure);
      }
    });
  });

  ApiSlice.pruneCache("impactStories");
  ApiSlice.pruneIndex("impactStories", "");
};
