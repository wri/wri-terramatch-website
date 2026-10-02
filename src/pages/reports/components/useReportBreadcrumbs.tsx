import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { useLightNursery, useLightProject, useLightSite } from "@/connections/Entity";
import { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import { NurseryIcon, ProjectIcon, ReportsIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";

import { getReportProfileOriginFromQuery, getReportsIndexHrefFromQuery } from "../reportIndex.utils";

type Breadcrumbs = BannerProps["breadcrumbs"];

/**
 * Breadcrumbs for a report page, based on where the report was opened from:
 * - a project / site / nursery Reports tab: `<Projects|Sites|Nurseries> > <entity name> > <report>`
 * - the reports index (or anywhere else): `Reports > <report>`
 */
export const useReportBreadcrumbs = (reportCrumb: Breadcrumbs[number], fallbackIndexHref: string): Breadcrumbs => {
  const t = useT();
  const router = useRouter();
  const origin = getReportProfileOriginFromQuery(router.query.profile, router.query.profileUuid);

  const [, { data: project }] = useLightProject({
    id: origin?.source === "project" ? origin.uuid : undefined,
    enabled: origin?.source === "project"
  });
  const [, { data: site }] = useLightSite({
    id: origin?.source === "site" ? origin.uuid : undefined,
    enabled: origin?.source === "site"
  });
  const [, { data: nursery }] = useLightNursery({
    id: origin?.source === "nursery" ? origin.uuid : undefined,
    enabled: origin?.source === "nursery"
  });

  switch (origin?.source) {
    case "project":
      return [
        { label: t("Projects"), link: "/my-projects", icon: <ProjectIcon className="!text-theme-primary-900" /> },
        { label: project?.name ?? "", link: `/project/${origin.uuid}?tab=reports` },
        reportCrumb
      ];

    case "site":
      return [
        { label: t("Sites"), link: "/site", icon: <SiteIcon className="!text-theme-primary-900" /> },
        { label: site?.name ?? "", link: `/site/${origin.uuid}?tab=reports` },
        reportCrumb
      ];

    case "nursery":
      return [
        { label: t("Nurseries"), link: "/nurserie", icon: <NurseryIcon className="!text-theme-primary-900" /> },
        { label: nursery?.name ?? "", link: `/nurserie/${origin.uuid}?tab=reports` },
        reportCrumb
      ];

    default:
      return [
        {
          label: t("Reports"),
          link: getReportsIndexHrefFromQuery(router.query.from) ?? fallbackIndexHref,
          icon: <ReportsIcon className="!text-theme-primary-900" />
        },
        reportCrumb
      ];
  }
};
