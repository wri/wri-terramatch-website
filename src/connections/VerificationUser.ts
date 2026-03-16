import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import { verifyUser } from "@/generated/v3/userService/userServiceComponents";
import { VerificationUserResponseDto } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

export const selectVerificationUser = (store: ApiDataStore) =>
  Object.values(store.verifications)?.[0]?.attributes as VerificationUserResponseDto | undefined;

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
    if (token != null && token !== "" && isSuccess == null && requestFailed == null)
      verifyUser.fetch({ body: { token } });
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
          isSuccess: selector != null ? selector.verified : null
        })
      )
  )
};

export const useVerificationUser = connectionHook(verificationUserConnection);
