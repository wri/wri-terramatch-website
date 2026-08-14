import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useCallback, useMemo, useState } from "react";

import {
  loadFullDisturbanceReport,
  loadFullFinancialReport,
  loadFullNurseryReport,
  loadFullProjectReport,
  loadFullSiteReport,
  loadFullSRPReport,
  SupportedEntity
} from "@/connections/Entity";
import { entityExportAll, entityUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { EntityUpdateBody } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDownloadToastMessages } from "@/hooks/translation/useDownloadToastMessages";
import { useReportsIndexAnalytics } from "@/hooks/useReportsIndexAnalytics";
import ApiSlice from "@/store/apiSlice";
import { runWithDownloadToast } from "@/utils/downloadToast";
import Log from "@/utils/log";

import type { ReportIndexItem } from "./reportIndex.types";
import {
  groupReportUuidsByEntity,
  isReportNothingToReportEligible,
  isReportSubmittable,
  REPORT_INDEX_TYPE_TO_ENTITY
} from "./reportIndex.utils";

type UseReportsBulkActionsProps = {
  selectedReports: ReportIndexItem[];
  clearSelection: () => void;
  onReportsChanged: () => void;
};

const updateReport = async (report: ReportIndexItem, attributes: EntityUpdateBody["data"]["attributes"]) => {
  const entity = REPORT_INDEX_TYPE_TO_ENTITY[report.type];
  await entityUpdate.fetchAwait({
    pathParams: { entity, uuid: report.id },
    body: {
      data: {
        type: entity,
        id: report.id,
        attributes
      } as EntityUpdateBody["data"]
    }
  });
};

const reloadReport = (report: ReportIndexItem) => {
  switch (report.type) {
    case "project-report":
      return loadFullProjectReport({ id: report.id });
    case "site-report":
      return loadFullSiteReport({ id: report.id });
    case "nursery-report":
      return loadFullNurseryReport({ id: report.id });
    case "financial-report":
      return loadFullFinancialReport({ id: report.id });
    case "disturbance-report":
      return loadFullDisturbanceReport({ id: report.id });
    case "srp-report":
      return loadFullSRPReport({ id: report.id });
  }
};

/** Invalidate only touched UUIDs, then refetch so progress `.list()` cache and indexes see fresh data. */
const refreshSelectedReports = async (reports: ReportIndexItem[]) => {
  for (const [entity, uuids] of Object.entries(groupReportUuidsByEntity(reports))) {
    if (uuids == null || uuids.length === 0) continue;
    ApiSlice.pruneCache(entity as SupportedEntity, uuids);
  }
  await Promise.all(reports.map(reloadReport));
};

export const useReportsBulkActions = ({
  selectedReports,
  clearSelection,
  onReportsChanged
}: UseReportsBulkActionsProps) => {
  const t = useT();
  const downloadToastMessages = useDownloadToastMessages();
  const { trackBulkActionSubmitted } = useReportsIndexAnalytics();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const submittableReports = useMemo(() => selectedReports.filter(isReportSubmittable), [selectedReports]);
  const nothingToReportReports = useMemo(
    () => selectedReports.filter(isReportNothingToReportEligible),
    [selectedReports]
  );

  const canSubmit = selectedReports.length > 0 && submittableReports.length === selectedReports.length;
  const canMarkNothingToReport = selectedReports.length > 0 && nothingToReportReports.length === selectedReports.length;
  const selectionIncludesProjectReport = selectedReports.some(report => report.type === "project-report");

  const submitDisabledTooltip = useMemo(() => {
    if (canSubmit) return undefined;
    if (selectedReports.length === 1) {
      return t("This report is missing mandatory information. Please complete the required fields before submitting.");
    }
    return t("One or more selected reports must be completed before submission.");
  }, [canSubmit, selectedReports.length, t]);

  const nothingToReportDisabledTooltip = useMemo(() => {
    if (canMarkNothingToReport) return undefined;
    if (selectionIncludesProjectReport) {
      return selectedReports.length === 1
        ? t("Project reports cannot be marked as nothing to report.")
        : t("One or more selected reports cannot be marked as nothing to report. Project reports are not eligible.");
    }
    return selectedReports.length === 1
      ? t("This report cannot be marked as nothing to report.")
      : t("One or more selected reports cannot be marked as nothing to report.");
  }, [canMarkNothingToReport, selectionIncludesProjectReport, selectedReports.length, t]);

  const handleDownload = useCallback(async () => {
    if (selectedReports.length === 0 || isDownloading) return;

    setIsDownloading(true);
    try {
      await runWithDownloadToast(
        {
          downloading: t("Downloading reports"),
          complete: downloadToastMessages.complete,
          error: downloadToastMessages.error
        },
        async () => {
          const grouped = groupReportUuidsByEntity(selectedReports);
          for (const [entity, uuids] of Object.entries(grouped)) {
            if (uuids == null || uuids.length === 0) continue;
            await entityExportAll.downloadFile({
              pathParams: { entity: entity as SupportedEntity },
              queryParams: { uuids }
            });
          }
        },
        "reportsBulkExportToast"
      );
    } catch (error) {
      showToast({
        label: downloadToastMessages.error,
        type: "error",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    } finally {
      setIsDownloading(false);
    }
  }, [downloadToastMessages, isDownloading, selectedReports, t]);

  const handleNothingToReport = useCallback(async () => {
    if (!canMarkNothingToReport || isUpdating) return;

    setIsUpdating(true);
    try {
      for (const report of nothingToReportReports) {
        await updateReport(report, { nothingToReport: true });
      }
      trackBulkActionSubmitted({
        actionType: "mark_nothing_to_report",
        selectedCount: selectedReports.length,
        eligibleCount: nothingToReportReports.length
      });
      await refreshSelectedReports(nothingToReportReports);
      clearSelection();
      onReportsChanged();
      showToast({
        label: t("Reports marked as nothing to report"),
        type: "success",
        placement: "bottom"
      });
    } catch (error) {
      Log.error("Error marking reports as nothing to report", error);
      showToast({
        label: t("Something went wrong!"),
        type: "error",
        placement: "bottom"
      });
    } finally {
      setIsUpdating(false);
    }
  }, [
    canMarkNothingToReport,
    clearSelection,
    isUpdating,
    nothingToReportReports,
    onReportsChanged,
    selectedReports.length,
    t,
    trackBulkActionSubmitted
  ]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isUpdating) return;

    setIsUpdating(true);
    try {
      for (const report of submittableReports) {
        await updateReport(report, { status: "pending-approval" });
      }
      trackBulkActionSubmitted({
        actionType: "submit_for_approval",
        selectedCount: selectedReports.length,
        eligibleCount: submittableReports.length
      });
      await refreshSelectedReports(submittableReports);
      clearSelection();
      onReportsChanged();
      showToast({
        label: t("Reports submitted"),
        type: "success",
        placement: "bottom"
      });
    } catch (error) {
      Log.error("Error submitting reports", error);
      showToast({
        label: t("Something went wrong!"),
        type: "error",
        placement: "bottom"
      });
    } finally {
      setIsUpdating(false);
    }
  }, [
    canSubmit,
    clearSelection,
    isUpdating,
    onReportsChanged,
    selectedReports.length,
    submittableReports,
    t,
    trackBulkActionSubmitted
  ]);

  return {
    isDownloading,
    isUpdating,
    canSubmit,
    canMarkNothingToReport,
    submitDisabledTooltip,
    nothingToReportDisabledTooltip,
    handleDownload,
    handleNothingToReport,
    handleSubmit
  };
};
