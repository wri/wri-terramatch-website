import { useRouter } from "next/router";
import { useMemo } from "react";

export interface BreadcrumbContextData {
  contextType?: string;
  projectUuid?: string;
  projectName?: string;
  siteUuid?: string;
  siteName?: string;
  nurseryUuid?: string;
  nurseryName?: string;
}

/**
 * Hook that reads breadcrumb context from URL query parameters.
 * Provides navigation trail information for breadcrumb components.
 *
 * Query parameters:
 * - from: context type (project, site, nursery)
 * - projectUuid/projectName: project identifiers
 * - siteUuid/siteName: site identifiers
 * - nurseryUuid/nurseryName: nursery identifiers
 */
const useBreadcrumbContext = (): BreadcrumbContextData => {
  const router = useRouter();

  return useMemo(() => {
    if (!router.isReady) {
      return {};
    }

    return {
      contextType: (router.query.from as string) || undefined,
      projectUuid: (router.query.projectUuid as string) || undefined,
      projectName: (router.query.projectName as string) || undefined,
      siteUuid: (router.query.siteUuid as string) || undefined,
      siteName: (router.query.siteName as string) || undefined,
      nurseryUuid: (router.query.nurseryUuid as string) || undefined,
      nurseryName: (router.query.nurseryName as string) || undefined
    };
  }, [router.isReady, router.query]);
};

export default useBreadcrumbContext;
