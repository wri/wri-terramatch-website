import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import { userVerify } from "@/generated/v3/userService/userServiceComponents";
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
          userVerify.isFetchingSelector({ pathParams: { uuid } }),
          userVerify.fetchFailedSelector({ pathParams: { uuid } })
        ],
        (isLoading, requestFailed) => ({
          isLoading,
          requestFailed,
          verifyUser: () => userVerify.fetch({ pathParams: { uuid } })
        })
      )
  )
};

export const useAdminUserVerify = connectionHook(adminUserVerifyConnection);

// NOTE: adminUsersResetPassword is not exposed in the current userService OpenAPI spec.
type AdminUserResetPasswordHookResult = [boolean, { resetPassword: (password: string) => void }];

export const useAdminUserResetPassword = (_props?: { uuid: string }): AdminUserResetPasswordHookResult => [
  false,
  {
    resetPassword: () => {
      // no-op: admin reset password endpoint not in API
    }
  }
];
