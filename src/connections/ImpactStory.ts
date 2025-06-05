import { createSelector } from "reselect";

import {
  impactStoryGet,
  impactStoryIndex,
  ImpactStoryIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ImpactStoryLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  impactStoryGetFetchFailed,
  impactStoryGetIsFetching,
  impactStoryIndexFetchFailed,
  impactStoryIndexIndexMeta
} from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

const impactStoriesSelector = ({ impactStories }: ApiDataStore) => impactStories;

type ImpactStoryConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  impactStory: ImpactStoryLightDto | null;
};

type ImpactStoryConnectionProps = {
  uuid: string;
};

const impactStoryIsLoaded = ({ requestFailed, impactStory }: ImpactStoryConnection) =>
  requestFailed != null || impactStory != null;

const impactStoryConnection: Connection<ImpactStoryConnection, ImpactStoryConnectionProps> = {
  load: (connection, { uuid }) => {
    if (!impactStoryIsLoaded(connection)) impactStoryGet({ pathParams: { uuid } });
  },

  isLoaded: impactStoryIsLoaded,
  selector: selectorCache(
    ({ uuid }: ImpactStoryConnectionProps) => uuid,
    ({ uuid }: ImpactStoryConnectionProps) =>
      createSelector(
        [
          impactStoryGetIsFetching({ pathParams: { uuid } }),
          impactStoryGetFetchFailed({ pathParams: { uuid } }),
          impactStoriesSelector
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          impactStory: selector[uuid]?.attributes ?? null
        })
      )
  )
};

export type ImpactStoriesConnection = {
  fetchFailure: PendingErrorState | null;
  data?: ImpactStoryLightDto[];
  indexTotal?: number;
};

type ImpactStoryIndexFilterKey = keyof Omit<
  ImpactStoryIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;

export type ImpactStoryIndexConnectionProps = {
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  filter?: Partial<Record<ImpactStoryIndexFilterKey, string>>;
  country?: string;
};

const impactStoryIndexQuery = (props?: ImpactStoryIndexConnectionProps) => {
  const queryParams = {
    "page[number]": props?.pageNumber,
    "page[size]": props?.pageSize
  } as ImpactStoryIndexQueryParams;
  if (props?.sortField != null) {
    queryParams["sort[field]"] = props.sortField;
    queryParams["sort[direction]"] = props.sortDirection ?? "ASC";
  }
  if (props?.filter != null) {
    for (const [key, value] of Object.entries(props.filter)) {
      (queryParams as Record<string, string | number | undefined>)[key] = value;
    }
  }
  if (props?.country != null) {
    queryParams["country"] = props.country;
  }
  return queryParams;
};

const indexCacheKey = (props: ImpactStoryIndexConnectionProps) => getStableQuery(impactStoryIndexQuery(props));

const impactStoriesIndexParams = (props?: ImpactStoryIndexConnectionProps) => ({
  queryParams: impactStoryIndexQuery(props)
});

const impactStoriesConnection: Connection<ImpactStoriesConnection, ImpactStoryIndexConnectionProps> = {
  load: ({ data }, props) => {
    if (!data) impactStoryIndex(impactStoriesIndexParams(props));
  },

  isLoaded: ({ data }) => data !== undefined,
  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          impactStoryIndexIndexMeta("impactStories", impactStoriesIndexParams(props)),
          impactStoryIndexFetchFailed(impactStoriesIndexParams(props)),
          impactStoriesSelector
        ],
        (indexMeta, fetchFailure, selector) => {
          if (indexMeta == null) return { fetchFailure };

          const entities = [] as ImpactStoryLightDto[];
          for (const id of indexMeta.ids) {
            if (selector[id] == null) return { fetchFailure };
            entities.push(selector[id].attributes);
          }

          return { data: entities, indexTotal: indexMeta.total, fetchFailure };
        }
      )
  )
};

export const loadImpactStories = connectionLoader(impactStoriesConnection);
export const loadImpactStory = connectionLoader(impactStoryConnection);
export const useImpactStory = connectionHook(impactStoriesConnection);
