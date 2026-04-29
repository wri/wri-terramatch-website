import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  getResetPassword,
  requestPasswordReset,
  resetPassword
} from "@/generated/v3/userService/userServiceComponents";
import { ResetPasswordResponseDto } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

import { v3Resource } from "./util/apiConnectionFactory";

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
  // @ts-expect-error
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

const getResetPasswordConnection = v3Resource("passwordResets", getResetPassword)
  .singleByCustomId<ResetPasswordResponseDto, { token: string }>(
    ({ token }) => ({ pathParams: { token: token } }),
    ({ token }) => {
      return token;
    }
  )
  .isLoading()
  .enabledProp()
  .buildConnection();

export const useGetResetPassword = connectionHook(getResetPasswordConnection);

export const useRequestPassword = connectionHook(requestPasswordConnection);

export const useResetPassword = connectionHook(resetPasswordConnection);
