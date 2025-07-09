import { v3Endpoint } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  impactStoryGet,
  impactStoryIndex,
  ImpactStoryIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ImpactStoryFullDto, ImpactStoryLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

const impactStoryConnection = v3Endpoint("impactStories", impactStoryGet)
  .singleFullResource<ImpactStoryFullDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .isLoading()
  .buildConnection();

type ImpactStoryIndexFilter = Omit<
  ImpactStoryIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;

const impactStoriesConnection = v3Endpoint("impactStories", impactStoryIndex)
  .index<ImpactStoryLightDto>()
  .pagination()
  .filter<ImpactStoryIndexFilter>()
  .buildConnection();

export const useImpactStory = connectionHook(impactStoryConnection);
export const useImpactStories = connectionHook(impactStoriesConnection);

export const loadImpactStory = connectionLoader(impactStoryConnection);
export const loadImpactStories = connectionLoader(impactStoriesConnection);
