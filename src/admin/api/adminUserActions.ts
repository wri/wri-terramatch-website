import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { getAccessToken } from "@/admin/apiProvider/utils/token";
import { apiBaseUrl } from "@/constants/environment";

const ADMIN_USERS_BASE = `${apiBaseUrl}/api/v3/admin/users`;

export type AdminResetPasswordVariables = {
  uuid: string;
  password: string;
};

export type AdminVerifyUserVariables = {
  uuid: string;
};

export type AdminUserActionError = {
  statusCode: number;
  message?: string;
  detail?: string;
  errors?: Array<{ detail?: string }>;
};

async function parseErrorResponse(res: Response): Promise<AdminUserActionError> {
  const body = await res.json().catch(() => ({}));
  const message =
    (Array.isArray(body?.errors) && body.errors[0]?.detail) || body?.message || body?.detail || res.statusText;
  return {
    statusCode: res.status,
    message: typeof message === "string" ? message : "Request failed",
    detail: body?.errors?.[0]?.detail,
    errors: body?.errors
  };
}

async function fetchWithAuth(url: string, init: RequestInit & { method: string; body?: string }): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.body != null ? { "Content-Type": "application/json" } : {}),
    ...(init.headers as HeadersInit)
  };
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    throw await parseErrorResponse(res);
  }
}

/**
 * PUT {BASE}/admin/users/reset-password/:uuid
 * Body: { password }. Success 200: "Password Updated". 400 validation, 401 unauthorized, 404 not found.
 */
export async function fetchAdminResetPassword(variables: AdminResetPasswordVariables): Promise<void> {
  const url = `${ADMIN_USERS_BASE}/reset-password/${variables.uuid}`;
  await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify({ password: variables.password })
  });
}

/**
 * PATCH {BASE}/admin/users/verify/:uuid
 * No body. Success 200: "User verified.". 401 unauthorized, 404 not found.
 */
export async function fetchAdminVerifyUser(variables: AdminVerifyUserVariables): Promise<void> {
  const url = `${ADMIN_USERS_BASE}/verify/${variables.uuid}`;
  await fetchWithAuth(url, { method: "PATCH" });
}

export function useAdminResetPassword(
  options?: Omit<UseMutationOptions<void, AdminUserActionError, AdminResetPasswordVariables>, "mutationFn">
) {
  return useMutation({
    mutationFn: fetchAdminResetPassword,
    ...options
  });
}

export function useAdminVerifyUser(
  options?: Omit<UseMutationOptions<void, AdminUserActionError, AdminVerifyUserVariables>, "mutationFn">
) {
  return useMutation({
    mutationFn: fetchAdminVerifyUser,
    ...options
  });
}
