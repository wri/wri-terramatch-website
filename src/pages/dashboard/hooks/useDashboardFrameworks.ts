import { useEffect, useState } from "react";

import { getAccessToken } from "@/admin/apiProvider/utils/token";
import { dashboardServiceUrl } from "@/constants/environment";
import type { DashboardFramework } from "@/context/dashboard.provider";
import type { GetDashboardProjectsQueryParams } from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { getStableQuery } from "@/generated/v3/utils";

export type DashboardFrameworksQueryParams = GetDashboardProjectsQueryParams;

export type UseDashboardFrameworksResult = {
  data: DashboardFramework[];
  isLoading: boolean;
  error: { statusCode: number; message: string } | null;
};

/**
 * Fetches the list of frameworks from GET /dashboard/v3/frameworks (plain array response).
 * Uses direct fetch because the endpoint returns a non-JSON:API array.
 * URL: {dashboardServiceUrl}/dashboard/v3/frameworks — see docs/VERIFICACION_V3_FRAMEWORKS.md for v3 verification.
 */
export function useDashboardFrameworks(queryParams?: DashboardFrameworksQueryParams): UseDashboardFrameworksResult {
  const [data, setData] = useState<DashboardFramework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ statusCode: number; message: string } | null>(null);

  const queryKey = JSON.stringify(queryParams ?? {});

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    const params = queryParams ? { ...queryParams } : {};
    const query = getStableQuery(params);
    const url = `${dashboardServiceUrl}/dashboard/v3/frameworks${query}`;

    const headers: HeadersInit = { "Content-Type": "application/json" };
    const token = typeof window !== "undefined" ? getAccessToken() : null;
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(url, { method: "GET", headers })
      .then(async res => {
        if (cancelled) return;
        if (!res.ok) {
          const err = await res.json().catch(() => ({ statusCode: res.status, message: res.statusText }));
          setError(err);
          setData([]);
          return;
        }
        const json = await res.json();
        if (!Array.isArray(json)) {
          setError({ statusCode: -1, message: "Invalid response shape" });
          setData([]);
          return;
        }
        setData(
          json.map((item: { framework_slug?: string; name?: string }) => ({
            framework_slug: item.framework_slug,
            name: item.name
          }))
        );
        setError(null);
      })
      .catch(e => {
        if (!cancelled) {
          setError({
            statusCode: -1,
            message: e instanceof Error ? e.message : "Network error"
          });
          setData([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryKey, queryParams]);

  return { data, isLoading, error };
}
