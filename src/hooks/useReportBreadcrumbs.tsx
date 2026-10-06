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
  const origin = getReportProfileOriginFromQuery(router.query.profile, router.query.profileUuid);
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

  switch (origin.source) {
    case "project":
      return [
        { label: t("Projects"), link: "/my-projects", icon: <ProjectIcon className="!text-theme-primary-900" /> },
        { label: originName, link: getEntityDetailPageLink("projects", origin.uuid, "reports") },
        reportCrumb
      ];

    case "site":
      return [
        { label: t("Sites"), link: "/site", icon: <SiteIcon className="!text-theme-primary-900" /> },
        { label: originName, link: getEntityDetailPageLink("sites", origin.uuid, "reports") },
        reportCrumb
      ];

    case "nursery":
      return [
        { label: t("Nurseries"), link: "/nurserie", icon: <NurseryIcon className="!text-theme-primary-900" /> },
        { label: originName, link: getEntityDetailPageLink("nurseries", origin.uuid, "reports") },
        reportCrumb
      ];
  }
};
