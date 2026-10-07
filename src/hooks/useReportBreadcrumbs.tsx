import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { getEntityDetailPageLink } from "@/helpers/entity";
import {
  getReportProfileOriginFromQuery,
  getReportsIndexHrefFromQuery,
  ReportsIndexSource
} from "@/pages/reports/reportIndex.utils";
import { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import { NurseryIcon, ProjectIcon, ReportsIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";

type Breadcrumbs = BannerProps["breadcrumbs"];

export type ReportBreadcrumbNames = Partial<Record<ReportsIndexSource, string | null>>;

export const useReportBreadcrumbs = (
  reportCrumb: Breadcrumbs[number],
  fallbackIndexHref: string,
  names: ReportBreadcrumbNames = {}
): Breadcrumbs => {
  const t = useT();
  const router = useRouter();

  let origin = getReportProfileOriginFromQuery(router.query.profile, router.query.profileUuid);
  const contextOrigin = typeof router.query.origin === "string" ? router.query.origin : undefined;
  const projectNameFromUrl = typeof router.query.projectName === "string" ? router.query.projectName : undefined;
  const projectName = projectNameFromUrl ?? names.project;

  if (origin == null) {
    const directOrigin = contextOrigin;
    if (directOrigin === "site" || directOrigin === "nursery" || directOrigin === "project") {
      // For direct origin param, we don't have the UUID, so can't construct full breadcrumbs
      origin = undefined;
    }
  }

  const originName = origin == null ? undefined : names[origin.source];

  if (origin == null || originName == null) {
    return [
      {
        label: t("Reports"),
        link: getReportsIndexHrefFromQuery(router.query.from) ?? fallbackIndexHref,
        icon: <ReportsIcon className="!text-theme-primary-900" />
      },
      reportCrumb
    ];
  }

  if (contextOrigin === "sites" && origin.source === "site") {
    return [
      { label: t("Sites"), link: "/site", icon: <SiteIcon className="!text-theme-primary-900" /> },
      { label: originName, link: getEntityDetailPageLink("sites", origin.uuid, "reports") },
      reportCrumb
    ];
  }

  if (contextOrigin === "nurseries" && origin.source === "nursery") {
    return [
      { label: t("Nurseries"), link: "/nurserie", icon: <NurseryIcon className="!text-theme-primary-900" /> },
      { label: originName, link: getEntityDetailPageLink("nurseries", origin.uuid, "reports") },
      reportCrumb
    ];
  }

  // Otherwise show the project-based path
  switch (origin.source) {
    case "project":
      return [
        { label: t("Projects"), link: "/my-projects", icon: <ProjectIcon className="!text-theme-primary-900" /> },
        { label: originName, link: getEntityDetailPageLink("projects", origin.uuid, "reports") },
        reportCrumb
      ];

    case "site":
      return [
        { label: t("Projects"), link: "/my-projects", icon: <ProjectIcon className="!text-theme-primary-900" /> },
        {
          label: projectName ?? t("Project"),
          link: `/my-projects`
        },
        { label: originName, link: getEntityDetailPageLink("sites", origin.uuid, "reports") },
        reportCrumb
      ];

    case "nursery":
      return [
        { label: t("Projects"), link: "/my-projects", icon: <ProjectIcon className="!text-theme-primary-900" /> },
        {
          label: projectName ?? t("Project"),
          link: `/my-projects`
        },
        { label: originName, link: getEntityDetailPageLink("nurseries", origin.uuid, "reports") },
        reportCrumb
      ];
  }
};
