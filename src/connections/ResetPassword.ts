import { createSelector } from "reselect";

import {
  requestPasswordResetFetchFailed,
  requestPasswordResetIsFetching,
  resetPasswordFetchFailed,
  resetPasswordIsFetching
} from "@/generated/v3/userService/userServicePredicates";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";

export const selectResetPassword = (store: ApiDataStore) => Object.values(store.logins)?.[0]?.attributes;

type RequestResetPasswordConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean;
  requestEmail: string;
};

const requestPasswordConnection: Connection<RequestResetPasswordConnection> = {
  selector: createSelector(
    [requestPasswordResetIsFetching, requestPasswordResetFetchFailed, selectResetPassword],
    (isLoading, requestFailed, selector) => {
      return {
        isLoading: isLoading,
        requestFailed: requestFailed,
        isSuccess: (selector as any) != null,
        requestEmail: (selector as any)?.emailAddress
      };
    }
  )
};

type ResetPasswordConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean;
};

const resetPasswordConnection: Connection<ResetPasswordConnection> = {
  selector: createSelector(
    [
      resetPasswordIsFetching({ pathParams: { token: "" } }),
      resetPasswordFetchFailed({ pathParams: { token: "" } }),
      selectResetPassword
    ],
    (isLoggingIn, requestFailed, selector) => {
      return {
        isLoading: isLoggingIn,
        requestFailed: requestFailed,
        isSuccess: (selector as any) != null
      };
    }
  )
};

export const useRequestPassword = connectionHook(requestPasswordConnection);

export const useResetPassword = connectionHook(resetPasswordConnection);
