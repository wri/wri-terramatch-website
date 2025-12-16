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

export const getFinancialReportStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "draft",
      title: t("Draft")
    },
    {
      value: "due",
      title: t("Draft")
    },
    {
      value: "started",
      title: t("Draft")
    },
    {
      value: "submitted",
      title: t("Submitted")
    },
    ...getReportStatusOptions(t)
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
      value: "needs-more-information",
      title: t("More info requested")
    }
  ] as Option[];
export const getPolygonOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "no-polygons",
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

export const getNothingReportOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "false",
      title: t("Reported Info")
    },
    {
      value: "true",
      title: t("Nothing to Report")
    }
  ] as Option[];

export const getPlantingStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "no-restoration-expected",
      title: t("No Restoration Expected")
    },
    {
      value: "not-started",
      title: t("Not Started")
    },
    {
      value: "in-progress",
      title: t("In Progress")
    },
    {
      value: "replacement-planting",
      title: t("Replacement Planting")
    },
    {
      value: "completed",
      title: t("Completed")
    }
  ] as Option[];
