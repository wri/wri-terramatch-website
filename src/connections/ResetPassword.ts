import { createSelector } from "reselect";

import { requestPasswordReset, resetPassword } from "@/generated/v3/userService/userServiceComponents";
import {
  requestPasswordResetFetchFailed,
  requestPasswordResetIsFetching,
  resetPasswordFetchFailed,
  resetPasswordIsFetching
} from "@/generated/v3/userService/userServicePredicates";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const RequestPasswordReset = (emailAddress: string, callbackUrl: string) =>
  requestPasswordReset({ body: { emailAddress, callbackUrl } });

export const selectResetPassword = (store: ApiDataStore) => Object.values(store.passwordResets)?.[0]?.attributes;

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
        isSuccess: selector?.emailAddress != null,
        requestEmail: selector?.emailAddress
      };
    }
  )
};

type ResetPasswordConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean;
  resetPassword: (password: string) => void;
};

type ResetPasswordProps = {
  token: string;
};

const resetPasswordConnection: Connection<ResetPasswordConnection, ResetPasswordProps> = {
  selector: selectorCache(
    ({ token }) => token,
    ({ token }) =>
      createSelector(
        [
          resetPasswordIsFetching({ pathParams: { token } }),
          resetPasswordFetchFailed({ pathParams: { token } }),
          selectResetPassword
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.emailAddress != null,
          resetPassword: (password: string) =>
            resetPassword({
              body: {
                newPassword: password
              },
              pathParams: {
                token: token
              }
            })
        })
      )
  )
};

export const useRequestPassword = connectionHook(requestPasswordConnection);

export const useResetPassword = connectionHook(resetPasswordConnection);
