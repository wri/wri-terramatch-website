import { createSelector } from "reselect";

import { projectPitchesGetUUIDIndex, projectPitchesIndex } from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
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

type ProjectPitchIndexConnectionProps = {
  perPage: number;
  search: string[];
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

type ProjectsPitchesConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  projectPitches: ProjectPitchDto[] | any;
};

const projectPitchesConnection: Connection<ProjectsPitchesConnection, ProjectPitchIndexConnectionProps> = {
  load: ({ projectPitches }, { perPage, search }) => {
    if (!projectPitches) projectPitchesIndex({ pathParams: { perPage: perPage, search: search } });
  },

  isLoaded: ({ projectPitches }) => projectPitches !== undefined,
  selector: selectorCache(
    ({ perPage, search }: ProjectPitchIndexConnectionProps) => perPage + search.join(""),
    ({ perPage, search }: ProjectPitchIndexConnectionProps) =>
      createSelector(
        [
          projectPitchesIndexIsFetching({ pathParams: { perPage: perPage, search: search } }),
          projectPitchesIndexFetchFailed({ pathParams: { perPage: perPage, search: search } }),
          selectProjectPitches
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          projectPitches: selector
        })
      )
  )
};

const projectPitchesAdminConnection: Connection<ProjectsPitchesConnection, ProjectPitchIndexConnectionProps> = {
  load: ({ projectPitches }, { perPage, search }) => {
    if (!projectPitches) projectPitchesIndex({ pathParams: { perPage: perPage, search: search } });
  },

  isLoaded: ({ projectPitches }) => projectPitches !== undefined,
  selector: selectorCache(
    ({ perPage, search }: ProjectPitchIndexConnectionProps) => perPage + search.join(""),
    ({ perPage, search }: ProjectPitchIndexConnectionProps) =>
      createSelector(
        [
          projectPitchesIndexIsFetching({ pathParams: { perPage: perPage, search: search } }), // TODO to change
          projectPitchesIndexFetchFailed({ pathParams: { perPage: perPage, search: search } }),
          selectProjectPitches
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          projectPitches: selector
        })
      )
  )
};

export const loadProjectPitches = connectionLoader(projectPitchesConnection);
export const loadProjectPitchesAdmin = connectionLoader(projectPitchesAdminConnection);
export const loadProjectPitch = connectionLoader(projectPitchConnection);
