import { createSelector } from "reselect";

import { projectPitchesGetUUIDIndex } from "@/generated/v3/entityService/entityServiceComponents";
import {
  projectPitchesGetUUIDIndexFetchFailed,
  projectPitchesGetUUIDIndexIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const selectProjectPitch = (store: ApiDataStore) => Object.values(store.projectPitches)?.[0]?.attributes;

type ProjectPitchConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean | null;
};

type ProjectPitchConnectionProps = {
  uuid: string;
};

const projectPitchConnection: Connection<ProjectPitchConnection, ProjectPitchConnectionProps> = {
  load: ({ isSuccess, requestFailed }, { uuid }) => {
    if (isSuccess == null && requestFailed == null) projectPitchesGetUUIDIndex({ pathParams: { uuid } });
  },

  isLoaded: ({ isSuccess }) => isSuccess !== null,
  selector: selectorCache(
    ({ uuid }: ProjectPitchConnectionProps) => uuid,
    ({ uuid }: ProjectPitchConnectionProps) =>
      createSelector(
        [projectPitchesGetUUIDIndexIsFetching, projectPitchesGetUUIDIndexFetchFailed, selectProjectPitch],
        (isLoading, requestFailed, projectPitch) => ({
          isLoading,
          requestFailed,
          isSuccess: projectPitch?.uuid || null
        })
      )
  )
};

export const loadProjectPitch = connectionLoader(projectPitchConnection);
