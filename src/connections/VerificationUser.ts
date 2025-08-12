import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import { verifyUser } from "@/generated/v3/userService/userServiceComponents";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

export const selectVerificationUser = (store: ApiDataStore) => Object.values(store.verifications)?.[0]?.attributes;

type VerificationUserConnection = {
  isLoading: boolean;
  requestFailed: PendingError | undefined;
  isSuccess: boolean | null;
};

type VerificationUserProps = {
  token: string;
};

// Note: this endpoint and usecase are weird and will wait to move to the factory pattern for a
// later refactor.
const verificationUserConnection: Connection<VerificationUserConnection, VerificationUserProps> = {
  load: ({ isSuccess, requestFailed }, { token }) => {
    if (isSuccess == null && requestFailed == null) verifyUser.fetch({ body: { token } });
  },

  isLoaded: ({ isSuccess }) => isSuccess !== null,
  selector: selectorCache(
    ({ token }) => token,
    ({ token }) =>
      createSelector(
        [verifyUser.isFetchingSelector({}), verifyUser.fetchFailedSelector({}), selectVerificationUser],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.verified
        })
      )
  )
};

export const useVerificationUser = connectionHook(verificationUserConnection);
