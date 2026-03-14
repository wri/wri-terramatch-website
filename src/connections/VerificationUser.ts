import { createSelector } from "reselect";

import type { CreateConnection } from "@/connections/util/apiConnectionFactory";
import { connectionHook, creationHook } from "@/connections/util/connectionShortcuts";
import { verifyUser } from "@/generated/v3/userService/userServiceComponents";
import { resolveUrl, V3ApiEndpoint } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

export const selectVerificationUser = (store: ApiDataStore) => Object.values(store.verifications)?.[0]?.attributes;

type ResendVerificationError = {
  statusCode: number;
  message: string;
};

type ResendVerificationResponse = {
  meta?: {
    resourceType?: "verifications";
  };
  data?: {
    type?: "verifications";
    id?: string;
    attributes?: {
      emailAddress?: string;
    };
  };
};

type ResendVerificationVariables = {
  body: {
    emailAddress: string;
    callbackUrl?: string;
  };
};

export type ResendVerificationDto = {
  emailAddress: string;
};

export type ResendVerificationAttributes = {
  emailAddress: string;
  callbackUrl?: string;
};

function isResendVerificationData(attrs: unknown): attrs is ResendVerificationDto {
  return (
    typeof attrs === "object" &&
    attrs != null &&
    "emailAddress" in attrs &&
    typeof (attrs as ResendVerificationDto).emailAddress === "string"
  );
}

const resendVerificationEndpoint = new V3ApiEndpoint<
  ResendVerificationResponse,
  ResendVerificationError,
  ResendVerificationVariables,
  {}
>("/auth/v3/verifications/resend", "POST");

const resendVerificationConnection: Connection<
  CreateConnection<ResendVerificationDto, ResendVerificationAttributes>,
  {}
> = {
  selector: createSelector(
    [
      (store: ApiDataStore) => resendVerificationEndpoint.isFetchingSelector({})(store),
      (store: ApiDataStore) => resendVerificationEndpoint.fetchFailedSelector({})(store),
      (store: ApiDataStore) => resendVerificationEndpoint.completeSelector({})(store),
      (store: ApiDataStore) => store.verifications
    ],
    (isCreating, createFailure, complete, verifications) => {
      const create = (attributes: ResendVerificationAttributes) => {
        if (createFailure != null || complete != null) {
          ApiSlice.clearPending(resolveUrl(resendVerificationEndpoint.url, {}), resendVerificationEndpoint.method);
        }
        resendVerificationEndpoint.fetch({ body: attributes });
      };
      const resourceId = complete?.resourceIds?.[0];
      const attrs = resourceId != null ? verifications?.[resourceId]?.attributes : undefined;
      const data = isResendVerificationData(attrs) ? attrs : undefined;
      return {
        data,
        isCreating,
        createFailure,
        create
      };
    }
  )
};

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
