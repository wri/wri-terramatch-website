import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { getAccessToken } from "@/admin/apiProvider/utils/token";
import { userServiceUrl } from "@/constants/environment";

// Backend controller: @Controller("users/v3/users") + @Patch("verifyUser/:uuid")
// Local dev llama directamente al user-service (4010), no al gateway (8080),
// por eso usamos userServiceUrl en lugar de apiBaseUrl.
const VERIFY_USER_BASE = `${userServiceUrl}/users/v3/users`;

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
 * PATCH {BASE}/users/v3/users/verifyUser/:uuid
 * No body. Success 200: "User verified.". 401 unauthorized, 404 not found.
 */
export async function fetchAdminVerifyUser(variables: AdminVerifyUserVariables): Promise<void> {
  const url = `${VERIFY_USER_BASE}/verifyUser/${variables.uuid}`;
  await fetchWithAuth(url, { method: "PATCH" });
}

export function useAdminVerifyUser(
  options?: Omit<UseMutationOptions<void, AdminUserActionError, AdminVerifyUserVariables>, "mutationFn">
) {
  return useMutation({
    mutationFn: fetchAdminVerifyUser,
    ...options
  });
}
