import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  impactStoryGet,
  impactStoryIndex,
  ImpactStoryIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ImpactStoryFullDto, ImpactStoryLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

const impactStoryConnection = v3Resource("impactStories", impactStoryGet)
  .singleFullResource<ImpactStoryFullDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .isLoading()
  .buildConnection();

const impactStoriesConnection = v3Resource("impactStories", impactStoryIndex)
  .index<ImpactStoryLightDto>()
  .pagination()
  .filter<Filter<ImpactStoryIndexQueryParams>>()
  .buildConnection();

export const useImpactStory = connectionHook(impactStoryConnection);
export const useImpactStories = connectionHook(impactStoriesConnection);

export const loadImpactStory = connectionLoader(impactStoryConnection);
export const loadImpactStories = connectionLoader(impactStoriesConnection);
