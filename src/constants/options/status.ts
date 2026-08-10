import { useT } from "@transifex/react";

import { POLYGON_INFORMATION_REQUIRED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
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
      title: t("Due")
    },
    {
      value: "submitted",
      title: t("Submitted")
    },
    ...getReportStatusOptions(t).filter(option => !["due", "draft"].includes(option.value as string))
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
      value: "pending-approval",
      title: t("Pending Approval")
    },
    {
      value: "information-required",
      title: t("Information Required")
    }
  ] as Option[];

export const getStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "draft",
      title: t("Draft")
    },
    {
      value: "approved",
      title: t("Approved")
    },
    {
      value: "pending-approval",
      title: t("Pending Approval")
    },
    {
      value: "information-required",
      title: t("Information Required")
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
      value: POLYGON_PENDING_APPROVAL,
      title: t("Pending Approval Polygons")
    },
    {
      value: POLYGON_INFORMATION_REQUIRED,
      title: t("Information Required Polygons")
    },
    {
      value: "draft",
      title: t("Draft Polygons")
    }
  ] as Option[];
export const getChangeRequestStatusOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "no-update",
      title: t("No Update")
    },
    {
      value: "draft",
      title: t("Draft")
    },
    {
      value: "pending-approval",
      title: t("Pending Approval")
    },
    {
      value: "information-required",
      title: t("Information Required")
    },
    {
      value: "approved",
      title: t("Approved")
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
