import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { adminUsersVerify, AdminUsersVerifyError } from "@/generated/v3/userService/userServiceComponents";

export type AdminVerifyUserVariables = {
  uuid: string;
};

export type AdminUserActionError = {
  statusCode: number;
  message?: string;
};

const toAdminUserActionError = (error: AdminUsersVerifyError): AdminUserActionError => ({
  statusCode: error?.statusCode ?? -1,
  message: error?.message ?? "Request failed"
});

/**
 * PATCH /admin/users/verify/{uuid} (V3 endpoint via user service)
 * No body. Success 200: "User verified.". 401 unauthorized, 404 not found.
 */
export async function fetchAdminVerifyUser(variables: AdminVerifyUserVariables): Promise<void> {
  try {
    await adminUsersVerify.fetch({
      pathParams: { uuid: variables.uuid }
    });
  } catch (error) {
    throw toAdminUserActionError(error as AdminUsersVerifyError);
  }
}

export function useAdminVerifyUser(
  options?: Omit<UseMutationOptions<void, AdminUserActionError, AdminVerifyUserVariables>, "mutationFn">
) {
  return useMutation({
    mutationFn: fetchAdminVerifyUser,
    ...options
  });
}
