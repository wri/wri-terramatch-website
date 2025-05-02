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

const projectPitchesConnection: Connection<ProjectsPitchesConnection, ProjectPitchConnectionProps> = {
  load: ({ projectPitches }, { uuid }) => {
    if (!projectPitches) projectPitchesIndex({ pathParams: { perPage: 10, search: [] } });
  },

  isLoaded: ({ projectPitches }) => projectPitches !== undefined,
  selector: selectorCache(
    ({ uuid }: ProjectPitchConnectionProps) => uuid,
    ({ uuid }: ProjectPitchConnectionProps) =>
      createSelector(
        [
          projectPitchesIndexIsFetching({ pathParams: { perPage: 10, search: [] } }),
          projectPitchesIndexFetchFailed({ pathParams: { perPage: 10, search: [] } }),
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
export const loadProjectPitch = connectionLoader(projectPitchConnection);
