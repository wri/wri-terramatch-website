import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getReportStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "due",
      title: t("Due")
    },
    ...getStatusOptions(t)
  ] as Option[];

export const getTaskStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "due",
      title: t("Due")
    },
    {
      value: "approved",
      title: t("Approved")
    },
    {
      value: "awaiting-approval",
      title: t("Awaiting Review")
    },
    {
      value: "needs-more-information",
      title: t("More info requested")
    }
  ] as Option[];

export const getStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "started",
      title: t("Started")
    },
    {
      value: "approved",
      title: t("Approved")
    },
    {
      value: "awaiting-approval",
      title: t("Awaiting Review")
    },
    {
      value: "restoration-in-progress",
      title: t("Restoration in progress")
    },
    {
      value: "needs-more-information",
      title: t("More info requested")
    }
  ] as Option[];
export const getPolygonOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "no-polygon",
      title: t("No polygons")
    },
    {
      value: "approved",
      title: t("Approved Polygons")
    },
    {
      value: "submitted",
      title: t("Submitted Polygons")
    },
    {
      value: "needs-more-information",
      title: t("Needs More Information Polygons")
    },
    {
      value: "draft",
      title: t("Draft Polygons")
    }
  ] as Option[];
export const getChangeRequestStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "draft",
      title: t("Started")
    },
    ...getStatusOptions(t).filter(option => option.value !== "started"),
    {
      value: "no-update",
      title: t("No update")
    }
  ] as Option[];
