import { createSelector } from "reselect";

import {
  projectPitchesGetUUIDIndexFetchFailed,
  projectPitchesGetUUIDIndexIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { verifyUser } from "@/generated/v3/userService/userServiceComponents";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const selectProjectPitch = (store: ApiDataStore) => Object.values(store.projectPitches)?.[0]?.attributes;

type ProjectPitchConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean | null;
};

type ProjectPitchConnectionProps = {
  token: string;
};

const projectPitchConnection: Connection<ProjectPitchConnection, ProjectPitchConnectionProps> = {
  load: ({ isSuccess, requestFailed }, { token }) => {
    if (isSuccess == null && requestFailed == null) verifyUser({ body: { token } });
  },

  isLoaded: ({ isSuccess }) => isSuccess !== null,
  selector: selectorCache(
    ({ token }) => token,
    ({ token }) =>
      createSelector(
        [projectPitchesGetUUIDIndexIsFetching, projectPitchesGetUUIDIndexFetchFailed, selectProjectPitch],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.uuid
        })
      )
  )
};

export const useProjectPitch = connectionHook(projectPitchConnection);
