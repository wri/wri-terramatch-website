import { createSelector } from "reselect";

import {
  adminProjectPitchesIndex,
  projectPitchesGetUUIDIndex,
  projectPitchesIndex
} from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  adminProjectPitchesIndexFetchFailed,
  adminProjectPitchesIndexIsFetching,
  projectPitchesGetUUIDIndexFetchFailed,
  projectPitchesGetUUIDIndexIsFetching,
  projectPitchesIndexFetchFailed,
  projectPitchesIndexIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const selectProjectPitch = (store: ApiDataStore) => Object.values(store.projectPitches)?.[0]?.attributes;
export const selectProjectPitches = (store: ApiDataStore) => Object.values(store.projectPitches);

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
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  data: any;
  total?: number;
};

export type ProjectPitchIndexConnectionProps = {
  pageNumber: number;
  pageSize: number;
  search: string;
};

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
          requestFailed,
          data: selector
        })
      )
  )
};

const projectPitchesAdminConnection: Connection<ProjectsPitchesConnection, ProjectPitchIndexConnectionProps> = {
  load: ({ data }, { pageNumber, pageSize, search }) => {
    if (!data || data.length === 0)
      adminProjectPitchesIndex({ queryParams: { pageSize: pageSize, pageNumber: pageNumber, search: search } });
  },

  isLoaded: ({ data }) => data.length > 0,
  selector: selectorCache(
    ({ pageSize, pageNumber, search }: ProjectPitchIndexConnectionProps) => pageSize + search,
    ({ pageSize, pageNumber, search }: ProjectPitchIndexConnectionProps) =>
      createSelector(
        [
          adminProjectPitchesIndexIsFetching({
            queryParams: { pageNumber: pageNumber, pageSize: pageSize, search: search }
          }),
          adminProjectPitchesIndexFetchFailed({
            queryParams: { pageNumber: pageNumber, pageSize: pageSize, search: search }
          }),
          selectProjectPitches
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          data: selector,
          total: 0
        })
      )
  )
};

export const loadProjectPitches = connectionLoader(projectPitchesConnection);
export const loadProjectPitchesAdmin = connectionLoader(projectPitchesAdminConnection);
export const loadProjectPitch = connectionLoader(projectPitchConnection);
