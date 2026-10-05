import type { BreadcrumbContextData } from "@/hooks/useBreadcrumbContext";

/**
 * Utility to create URLs with breadcrumb context preserved.
 * Used when navigating to preserve the navigation trail for breadcrumbs.
 *
 * Example:
 * const url = createContextUrl("/site/123", { contextType: "project", projectUuid: "456", ... });
 * // Returns: /site/123?from=project&projectUuid=456&...
 */
export const createContextUrl = (baseUrl: string, contextData: Partial<BreadcrumbContextData>): string => {
  const params = new URLSearchParams();

  if (contextData.contextType) {
    params.append("from", contextData.contextType);
  }
  if (contextData.projectUuid) {
    params.append("projectUuid", contextData.projectUuid);
  }
  if (contextData.projectName) {
    params.append("projectName", contextData.projectName);
  }
  if (contextData.siteUuid) {
    params.append("siteUuid", contextData.siteUuid);
  }
  if (contextData.siteName) {
    params.append("siteName", contextData.siteName);
  }
  if (contextData.nurseryUuid) {
    params.append("nurseryUuid", contextData.nurseryUuid);
  }
  if (contextData.nurseryName) {
    params.append("nurseryName", contextData.nurseryName);
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
