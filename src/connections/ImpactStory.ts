import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import {
  impactStoryCreate,
  impactStoryDelete,
  impactStoryGet,
  impactStoryIndex,
  ImpactStoryIndexQueryParams,
  impactStoryUpdate,
  ImpactStoryUpdateVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  ImpactStoryFullDto,
  ImpactStoryLightDto,
  UpdateImpactStoryAttributes
} from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

const impactStoryConnection = v3Resource("impactStories", impactStoryGet)
  .singleFullResource<ImpactStoryFullDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .update<UpdateImpactStoryAttributes, ImpactStoryUpdateVariables>(impactStoryUpdate)
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
