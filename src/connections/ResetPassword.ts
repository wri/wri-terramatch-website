import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import { requestPasswordReset, resetPassword } from "@/generated/v3/userService/userServiceComponents";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

export const sendRequestPasswordReset = (emailAddress: string, callbackUrl: string) =>
  requestPasswordReset.fetch({ body: { emailAddress, callbackUrl } });

export const selectResetPassword = (store: ApiDataStore) => Object.values(store.passwordResets)?.[0]?.attributes;

type RequestResetPasswordConnection = {
  isLoading: boolean;
  requestFailed: PendingError | undefined;
  isSuccess: boolean;
  requestEmail: string;
};

const requestPasswordConnection: Connection<RequestResetPasswordConnection> = {
  selector: createSelector(
    [requestPasswordReset.isFetchingSelector({}), requestPasswordReset.fetchFailedSelector({}), selectResetPassword],
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
  requestFailed: PendingError | undefined;
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
          resetPassword.isFetchingSelector({ pathParams: { token } }),
          resetPassword.fetchFailedSelector({ pathParams: { token } }),
          selectResetPassword
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.emailAddress != null,
          resetPassword: (password: string) =>
            resetPassword.fetch({
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
