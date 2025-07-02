import { ApiConnectionFactory } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  impactStoryGet,
  ImpactStoryGetVariables,
  impactStoryIndex,
  ImpactStoryIndexQueryParams,
  ImpactStoryIndexVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import { ImpactStoryFullDto, ImpactStoryLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  impactStoryGetFetchFailed,
  impactStoryGetIsFetching,
  impactStoryIndexFetchFailed,
  impactStoryIndexIndexMeta
} from "@/generated/v3/entityService/entityServiceSelectors";

const impactStoryConnection = ApiConnectionFactory.singleFullResource<ImpactStoryFullDto, ImpactStoryGetVariables>(
  "impactStories",
  impactStoryGet,
  ({ id }) => (id == null ? undefined : { pathParams: { uuid: id } })
)
  .loadFailure(impactStoryGetFetchFailed)
  .isLoading(impactStoryGetIsFetching)
  .buildConnection();

type ImpactStoryIndexFilter = Omit<
  ImpactStoryIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;

const impactStoriesConnection = ApiConnectionFactory.index<ImpactStoryLightDto, ImpactStoryIndexVariables>(
  "impactStories",
  impactStoryIndex,
  impactStoryIndexIndexMeta
)
  .pagination()
  .filter<ImpactStoryIndexFilter>()
  .loadFailure(impactStoryIndexFetchFailed)
  .buildConnection();

export const useImpactStory = connectionHook(impactStoryConnection);
export const useImpactStories = connectionHook(impactStoriesConnection);

export const loadImpactStory = connectionLoader(impactStoryConnection);
export const loadImpactStories = connectionLoader(impactStoriesConnection);
