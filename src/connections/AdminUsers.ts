import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import { adminUsersResetPassword, adminUsersVerify } from "@/generated/v3/userService/userServiceComponents";
import { PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

type AdminUserVerifyConnection = {
  isLoading: boolean;
  requestFailed: PendingError | undefined;
  verifyUser: () => void;
};

type AdminUserVerifyProps = {
  uuid: string;
};

const adminUserVerifyConnection: Connection<AdminUserVerifyConnection, AdminUserVerifyProps> = {
  selector: selectorCache(
    ({ uuid }) => uuid,
    ({ uuid }) =>
      createSelector(
        [
          adminUsersVerify.isFetchingSelector({ pathParams: { uuid } }),
          adminUsersVerify.fetchFailedSelector({ pathParams: { uuid } })
        ],
        (isLoading, requestFailed) => ({
          isLoading,
          requestFailed,
          // This triggers PATCH /admin/users/verify/{uuid} via the V3 API layer.
          verifyUser: () => adminUsersVerify.fetch({ pathParams: { uuid } })
        })
      )
  )
};

type AdminUserResetPasswordConnection = {
  isLoading: boolean;
  requestFailed: PendingError | undefined;
  resetPassword: (password: string) => void;
};

type AdminUserResetPasswordProps = {
  uuid: string;
};

const adminUserResetPasswordConnection: Connection<AdminUserResetPasswordConnection, AdminUserResetPasswordProps> = {
  selector: selectorCache(
    ({ uuid }) => uuid,
    ({ uuid }) =>
      createSelector(
        [
          adminUsersResetPassword.isFetchingSelector({ pathParams: { uuid } }),
          adminUsersResetPassword.fetchFailedSelector({ pathParams: { uuid } })
        ],
        (isLoading, requestFailed) => ({
          isLoading,
          requestFailed,
          resetPassword: (password: string) =>
            adminUsersResetPassword.fetch({
              pathParams: { uuid },
              body: { password }
            })
        })
      )
  )
};

export const useAdminUserVerify = connectionHook(adminUserVerifyConnection);

export const useAdminUserResetPassword = connectionHook(adminUserResetPasswordConnection);
