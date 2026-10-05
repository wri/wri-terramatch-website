import { useMemo } from "react";

import useBreadcrumbContext from "@/hooks/useBreadcrumbContext";

import { BreadcrumbLink } from "./Breadcrumb";

export interface UseContextAwareBreadcrumbsParams {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

/**
 * Simple hook that dynamically builds complete breadcrumb trail.
 * Uses the context-aware Breadcrumb component logic internally.
 * Automatically detects navigation context from URL query params.
 * Works for any page type - no type hints needed.
 *
 * Usage:
 * const breadcrumbs = useContextAwareBreadcrumbs({
 *   label: "Site Report",
 *   link: "/reports/site-report/[uuid]",
 *   icon: <ReportsIcon />
 * });
 */
export const useContextAwareBreadcrumbs = ({
  label,
  link,
  icon
}: UseContextAwareBreadcrumbsParams): BreadcrumbLink[] => {
  const context = useBreadcrumbContext();

  return useMemo(() => {
    const breadcrumbs: BreadcrumbLink[] = [];
    const currentItem = { label, link, icon };

    // Auto-detect hierarchy from context
    if (context.contextType === "site" && context.projectUuid) {
      breadcrumbs.push({ label: "Projects", link: "/my-projects" });
      if (context.projectName) {
        breadcrumbs.push({
          label: context.projectName,
          link: `/project/${context.projectUuid}`
        });
      }
      if (context.siteUuid && context.siteName) {
        breadcrumbs.push({
          label: context.siteName,
          link: `/site/${context.siteUuid}`
        });
      }
    } else if (context.contextType === "nursery" && context.projectUuid) {
      breadcrumbs.push({ label: "Projects", link: "/my-projects" });
      if (context.projectName) {
        breadcrumbs.push({
          label: context.projectName,
          link: `/project/${context.projectUuid}`
        });
      }
      breadcrumbs.push({
        label: "Nurseries",
        link: `/project/${context.projectUuid}?tab=nurseries`
      });
      if (context.nurseryUuid && context.nurseryName) {
        breadcrumbs.push({
          label: context.nurseryName,
          link: `/nurserie/${context.nurseryUuid}`
        });
      }
    } else if (context.contextType === "project" && context.projectUuid) {
      breadcrumbs.push({ label: "Projects", link: "/my-projects" });
      if (context.projectName) {
        breadcrumbs.push({
          label: context.projectName,
          link: `/project/${context.projectUuid}`
        });
      }
    }

    breadcrumbs.push(currentItem);
    return breadcrumbs;
  }, [context, label, link, icon]);
};
