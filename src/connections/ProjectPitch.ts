import { createSelector } from "reselect";

import {
  projectPitchGet,
  projectPitchIndex,
  ProjectPitchIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  projectPitchGetFetchFailed,
  projectPitchGetIsFetching,
  projectPitchIndexFetchFailed,
  projectPitchIndexIndexMeta
} from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

const projectPitchesSelector = ({ projectPitches }: ApiDataStore) => projectPitches;

type ProjectPitchConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  projectPitch: ProjectPitchDto | null;
};

type ProjectPitchConnectionProps = {
  uuid: string;
};

const projectPitchConnection: Connection<ProjectPitchConnection, ProjectPitchConnectionProps> = {
  load: ({ projectPitch }, { uuid }) => {
    if (projectPitch == null) projectPitchGet({ pathParams: { uuid } });
  },

  isLoaded: ({ projectPitch }) => projectPitch !== null,
  selector: selectorCache(
    ({ uuid }: ProjectPitchConnectionProps) => uuid,
    ({ uuid }: ProjectPitchConnectionProps) =>
      createSelector(
        [
          projectPitchGetIsFetching({ pathParams: { uuid } }),
          projectPitchGetFetchFailed({ pathParams: { uuid } }),
          projectPitchesSelector
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          projectPitch: selector[uuid]?.attributes ?? null
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

type ProjectPitchIndexFilterKey = keyof Omit<
  ProjectPitchIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;

export type ProjectPitchIndexConnectionProps = {
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  filter?: Partial<Record<ProjectPitchIndexFilterKey, string>>;
};

const projectPitchIndexQuery = (props?: ProjectPitchIndexConnectionProps) => {
  const queryParams = {
    "page[number]": props?.pageNumber,
    "page[size]": props?.pageSize
  } as ProjectPitchIndexQueryParams;
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

const indexCacheKey = (props: ProjectPitchIndexConnectionProps) => getStableQuery(projectPitchIndexQuery(props));

const projectPitchesIndexParams = (props?: ProjectPitchIndexConnectionProps) => ({
  queryParams: projectPitchIndexQuery(props)
});

const projectPitchesConnection: Connection<ProjectsPitchesConnection, ProjectPitchIndexConnectionProps> = {
  load: ({ data }, props) => {
    if (!data) projectPitchIndex(projectPitchesIndexParams(props));
  },

  isLoaded: ({ data }) => data !== undefined,
  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          projectPitchIndexIndexMeta("projectPitches", projectPitchesIndexParams(props)),
          projectPitchIndexFetchFailed(projectPitchesIndexParams(props)),
          projectPitchesSelector
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

export const loadProjectPitches = connectionLoader(projectPitchesConnection);
export const loadProjectPitch = connectionLoader(projectPitchConnection);
