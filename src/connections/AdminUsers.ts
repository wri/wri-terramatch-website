// NOTE:
// The V3 userService OpenAPI spec no longer exposes the
// `adminUsersVerify` or `adminUsersResetPassword` endpoints.
// To keep the codebase compiling without relying on removed
// endpoints, we provide minimal no-op hooks here.

type AdminUserVerifyHookResult = [boolean, { verifyUser: () => void }];
type AdminUserResetPasswordHookResult = [boolean, { resetPassword: (password: string) => void }];

export const useAdminUserVerify = (): AdminUserVerifyHookResult => [
  false,
  {
    verifyUser: () => {
      // no-op: admin verification endpoint removed from API
    }
  }
];

export const useAdminUserResetPassword = (): AdminUserResetPasswordHookResult => [
  false,
  {
    resetPassword: () => {
      // no-op: admin reset password endpoint removed from API
    }
  }
];
