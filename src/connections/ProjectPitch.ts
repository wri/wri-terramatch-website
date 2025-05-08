import { createSelector } from "reselect";

import { EntityIndexFilterKey } from "@/connections/Entity";
import {
  adminProjectPitchesIndex,
  EntityIndexQueryParams,
  projectPitchesGetUUIDIndex
} from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  adminProjectPitchesIndexFetchFailed,
  adminProjectPitchesIndexIndexMeta,
  projectPitchesGetUUIDIndexFetchFailed,
  projectPitchesGetUUIDIndexIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

const projectPitchesSelector = () => (store: ApiDataStore) =>
  store["projectPitches"] as StoreResourceMap<ProjectPitchDto>;

type ProjectPitchConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean;
  projectPitch: ProjectPitchDto | any;
};

type ProjectPitchConnectionProps = {
  uuid: string;
};

const projectPitchConnection: Connection<ProjectPitchConnection, ProjectPitchConnectionProps> = {
  load: ({ projectPitch }, { uuid }) => {
    if (!projectPitch) projectPitchesGetUUIDIndex({ pathParams: { uuid } });
  },

  isLoaded: ({ projectPitch }) => projectPitch !== undefined,
  selector: selectorCache(
    ({ uuid }: ProjectPitchConnectionProps) => uuid,
    ({ uuid }: ProjectPitchConnectionProps) =>
      createSelector(
        [
          projectPitchesGetUUIDIndexIsFetching({ pathParams: { uuid } }),
          projectPitchesGetUUIDIndexFetchFailed({ pathParams: { uuid } }),
          projectPitchesSelector()
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.organisationId != null,
          projectPitch: selector[uuid]
        })
      )
  )
};

export type ProjectsPitchesConnection = {
  fetchFailure: PendingErrorState | null;
  data?: ProjectPitchDto[];
  indexTotal?: number;
  refetch: () => void;
};

export type ProjectPitchIndexConnectionProps = {
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  filter?: Partial<Record<EntityIndexFilterKey, string>>;
};

/*
const projectPitchesConnection: Connection<ProjectsPitchesConnection, ProjectPitchIndexConnectionProps> = {
  load: ({ data }, { pageSize, pageNumber, search }) => {
    if (!data) projectPitchesIndex({ queryParams: { pageSize: pageSize, pageNumber: pageNumber, search: search } });
  },

  isLoaded: ({ data }) => data !== undefined,
  selector: selectorCache(
    ({ pageSize, pageNumber, search }: ProjectPitchIndexConnectionProps) => pageSize + search,
    ({ pageSize, pageNumber, search }: ProjectPitchIndexConnectionProps) =>
      createSelector(
        [
          projectPitchesIndexIsFetching({
            queryParams: { pageSize: pageSize, pageNumber: pageNumber, search: search }
          }),
          projectPitchesIndexFetchFailed({
            queryParams: { pageSize: pageSize, pageNumber: pageNumber, search: search }
          }),
          selectProjectPitches
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          fetchFailure: requestFailed,
          data: selector
        })
      )
  )
};
*/

const entityIndexQuery = (props?: ProjectPitchIndexConnectionProps) => {
  const queryParams = {
    "page[number]": props?.pageNumber,
    "page[size]": props?.pageSize
  } as EntityIndexQueryParams;
  if (props?.sortField != null) {
    queryParams["sort[field]"] = props.sortField;
    queryParams["sort[direction]"] = props.sortDirection ?? "ASC";
  }
  if (props?.filter != null) {
    for (const [key, value] of Object.entries(props.filter)) {
      (queryParams as Record<string, string | number | undefined>)[key] = value;
    }
  }
  return queryParams;
};

const indexCacheKey = (props: ProjectPitchIndexConnectionProps) => getStableQuery(entityIndexQuery(props));

const projectPitchesIndexParams = (props?: ProjectPitchIndexConnectionProps) => ({
  queryParams: entityIndexQuery(props)
});

const projectPitchesAdminConnection: Connection<ProjectsPitchesConnection, ProjectPitchIndexConnectionProps> = {
  load: ({ data }, props) => {
    if (!data) adminProjectPitchesIndex(projectPitchesIndexParams(props));
  },

  isLoaded: ({ data }) => data !== undefined,
  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          adminProjectPitchesIndexIndexMeta("projectPitches", projectPitchesIndexParams(props)),
          adminProjectPitchesIndexFetchFailed(projectPitchesIndexParams(props)),
          projectPitchesSelector()
        ],
        (indexMeta, fetchFailure, selector) => {
          console.log(indexMeta);
          const refetch = () => ApiSlice.pruneIndex("projectPitches", "");
          if (indexMeta == null) return { refetch, fetchFailure };

          const entities = [] as ProjectPitchDto[];
          for (const id of indexMeta.ids) {
            if (selector[id] == null) return { refetch, fetchFailure };
            entities.push(selector[id].attributes);
          }

          return { data: entities, indexTotal: indexMeta.total, refetch, fetchFailure };
        }
      )
  )
};

// export const loadProjectPitches = connectionLoader(projectPitchesConnection);
export const loadProjectPitchesAdmin = connectionLoader(projectPitchesAdminConnection);
export const loadProjectPitch = connectionLoader(projectPitchConnection);
