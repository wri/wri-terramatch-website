import { createSelector } from "reselect";

import { verifyUser } from "@/generated/v3/userService/userServiceComponents";
import { verifyUserFetchFailed, verifyUserIsFetching } from "@/generated/v3/userService/userServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const selectVerificationUser = (store: ApiDataStore) => Object.values(store.verifications)?.[0]?.attributes;

type VerificationUserConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean | null;
};

type VerificationUserProps = {
  token: string;
};

const verificationUserConnection: Connection<VerificationUserConnection, VerificationUserProps> = {
  load: ({ isSuccess, requestFailed }, { token }) => {
    if (isSuccess == null && requestFailed == null) verifyUser({ body: { token } });
  },

  isLoaded: ({ isSuccess }) => isSuccess !== null,
  selector: selectorCache(
    ({ token }) => token,
    ({ token }) =>
      createSelector(
        [verifyUserIsFetching, verifyUserFetchFailed, selectVerificationUser],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.verified
        })
      )
  )
};

export const useVerificationUser = connectionHook(verificationUserConnection);
