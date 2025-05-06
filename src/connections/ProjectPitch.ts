import { createSelector } from "reselect";

import {
  adminProjectPitchesIndex,
  EntityIndexQueryParams,
  projectPitchesGetUUIDIndex
} from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  adminProjectPitchesIndexFetchFailed,
  projectPitchesGetUUIDIndexFetchFailed,
  projectPitchesGetUUIDIndexIsFetching,
  projectPitchesIndexIndexMeta
} from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const selectProjectPitch = (store: ApiDataStore) => Object.values(store.projectPitches)?.[0]?.attributes;
export const selectProjectPitches = (store: ApiDataStore) => Object.values(store.projectPitches);

const projectPitchSelector = () => (store: ApiDataStore) =>
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
          selectProjectPitch
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.organisationId != null,
          projectPitch: selector
        })
      )
  )
};

export type ProjectsPitchesConnection = {
  fetchFailure: PendingErrorState | null;
  data: ProjectPitchDto[];
  total?: number;
  refetch: () => void;
};

export type ProjectPitchIndexConnectionProps = {
  pageNumber: number;
  pageSize: number;
  search: string;
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
  /*if (props?.sortField != null) {
    queryParams["sort[field]"] = props.sortField;
    queryParams["sort[direction]"] = props.sortDirection ?? "ASC";
  }
  if (props?.filter != null) {
    for (const [key, value] of Object.entries(props.filter)) {
      if (key === "polygonStatus") queryParams.polygonStatus = value as PolygonStatus;
      else queryParams[key as Exclude<EntityIndexFilterKey, "polygonStatus">] = value;
    }
  }*/
  return queryParams;
};

const indexCacheKey = (props: ProjectPitchIndexConnectionProps) => getStableQuery(entityIndexQuery(props));

const projectPitchesAdminConnection: Connection<ProjectsPitchesConnection, ProjectPitchIndexConnectionProps> = {
  load: ({ data }, { pageNumber, pageSize, search }) => {
    if (data.length === 0)
      adminProjectPitchesIndex({ queryParams: { pageSize: pageSize, pageNumber: pageNumber, search: search } });
  },

  isLoaded: ({ data }) => data.length > 0,
  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          projectPitchesIndexIndexMeta("projectPitches", {
            queryParams: { pageNumber: props.pageNumber, pageSize: props.pageSize, search: props.search }
          }),
          adminProjectPitchesIndexFetchFailed({
            queryParams: { pageNumber: props.pageNumber, pageSize: props.pageSize, search: props.search }
          }),
          projectPitchSelector()
        ],
        (indexMeta, fetchFailure, selector) => {
          console.log(indexMeta);
          const refetch = () => ApiSlice.pruneIndex("projectPitches", "");
          console.log("refetch", refetch);
          if (indexMeta == null) return { data: [], refetch, fetchFailure };

          const entities = [] as ProjectPitchDto[];
          for (const id of indexMeta.ids) {
            // If we're missing any of the entities we're supposed to have, return nothing so the
            // index endpoint is queried again.
            if (selector[id] == null) return { data: [], refetch, fetchFailure };
            entities.push(selector[id].attributes);
          }

          console.log("entities", entities);

          return { data: entities, indexTotal: indexMeta.total, refetch, fetchFailure };
        }
      )
  )
};

// export const loadProjectPitches = connectionLoader(projectPitchesConnection);
export const loadProjectPitchesAdmin = connectionLoader(projectPitchesAdminConnection);
export const loadProjectPitch = connectionLoader(projectPitchConnection);
