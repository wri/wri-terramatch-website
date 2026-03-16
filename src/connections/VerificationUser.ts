import { createSelector } from "reselect";

import { type CreateConnection, v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, creationHook } from "@/connections/util/connectionShortcuts";
import { resendVerification, verifyUser } from "@/generated/v3/userService/userServiceComponents";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

export const selectVerificationUser = (store: ApiDataStore) => Object.values(store.verifications)?.[0]?.attributes;

export type ResendVerificationDto = {
  emailAddress: string;
};

export type ResendVerificationAttributes = {
  emailAddress: string;
  callbackUrl?: string;
};

const resendVerificationConnection: Connection<
  CreateConnection<ResendVerificationDto, ResendVerificationAttributes>,
  {}
> = v3Resource("verifications", resendVerification).create<ResendVerificationDto>().buildConnection();

export const useResendVerification = creationHook(resendVerificationConnection);

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
          isSuccess: selector?.verified
        })
      )
  )
};

export const useVerificationUser = connectionHook(verificationUserConnection);
