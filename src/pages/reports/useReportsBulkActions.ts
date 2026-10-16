import { useT } from "@transifex/react";
import { useCallback, useMemo, useState } from "react";

import {
  loadFullDisturbanceReport,
  loadFullFinancialReport,
  loadFullNurseryReport,
  loadFullProjectReport,
  loadFullSiteReport,
  loadFullSRPReport,
  pruneReportsMeta,
  SupportedEntity
} from "@/connections/Entity";
import { useMyOrg } from "@/connections/Organisation";
import { entityExportAll, entityUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { EntityUpdateBody } from "@/generated/v3/entityService/entityServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useReportsIndexAnalytics } from "@/hooks/useReportsIndexAnalytics";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
import ApiSlice from "@/store/apiSlice";
import {
  closeEntityProgressToast,
  completeEntityProgressToast,
  ENTITY_TOAST_IDS,
  showEntityErrorToast,
  showEntityProgressToast
} from "@/utils/entityOperationToasts";
import Log from "@/utils/log";
import { isReportOwnedByOtherOrg } from "@/utils/reportOwnership";

import type { ReportIndexItem } from "./reportIndex.types";
import {
  getEditDisabledTooltip,
  getNothingToReportDisabledTooltip,
  getSubmitDisabledTooltip,
  groupReportUuidsByEntity,
  isReportEditable,
  isReportNothingToReportEligible,
  isReportSubmittable,
  REPORT_INDEX_TYPE_TO_ENTITY
} from "./reportIndex.utils";

type UseReportsBulkActionsProps = {
  selectedReports: ReportIndexItem[];
  clearSelection: () => void;
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

/**
 * Invalidate only touched UUIDs, then refetch so progress `.list()` cache and indexes see fresh data.
 * The report meta (attention counts) and report counts are pruned as well so that they're refetched.
 */
const refreshSelectedReports = async (reports: ReportIndexItem[]) => {
  for (const [entity, uuids] of Object.entries(groupReportUuidsByEntity(reports))) {
    if (uuids == null || uuids.length === 0) continue;
    ApiSlice.pruneCache(entity as SupportedEntity, uuids);
  }
  pruneReportsMeta();
  await Promise.all(reports.map(reloadReport));
};

export const useReportsBulkActions = ({ selectedReports, clearSelection }: UseReportsBulkActionsProps) => {
  const t = useT();
  const { trackBulkActionSubmitted } = useReportsIndexAnalytics();
  const [, myOrg] = useMyOrg();
  const isAdmin = useIsAdmin();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const submittableReports = useMemo(() => selectedReports.filter(isReportSubmittable), [selectedReports]);
  const nothingToReportReports = useMemo(
    () => selectedReports.filter(isReportNothingToReportEligible),
    [selectedReports]
  );

  // Financial reports belong to an organisation; members of other organisations can't edit or submit them.
  const ownedByOtherOrgName = useMemo(() => {
    for (const report of selectedReports) {
      if (report.type !== "financial-report") continue;
      const owner = { uuid: report.organisationUuid, name: report.organisationName };
      if (isReportOwnedByOtherOrg(owner, myOrg?.organisationId, isAdmin)) return report.organisationName ?? "";
    }
    return null;
  }, [isAdmin, myOrg?.organisationId, selectedReports]);
  const ownershipTooltip = useMemo(
    () =>
      ownedByOtherOrgName == null
        ? undefined
        : t("This report belongs to {organizationName}. Only its members can edit or submit it.", {
            organizationName: ownedByOtherOrgName
          }),
    [ownedByOtherOrgName, t]
  );

  const canEdit = selectedReports.length === 1 && isReportEditable(selectedReports[0]) && ownedByOtherOrgName == null;
  const canSubmit =
    selectedReports.length > 0 && submittableReports.length === selectedReports.length && ownedByOtherOrgName == null;
  const canMarkNothingToReport =
    selectedReports.length > 0 &&
    nothingToReportReports.length === selectedReports.length &&
    ownedByOtherOrgName == null;

  const editDisabledTooltip = useMemo(
    () => ownershipTooltip ?? getEditDisabledTooltip(selectedReports, t),
    [ownershipTooltip, selectedReports, t]
  );
  const submitDisabledTooltip = useMemo(
    () => ownershipTooltip ?? getSubmitDisabledTooltip(selectedReports, t),
    [ownershipTooltip, selectedReports, t]
  );
  const nothingToReportDisabledTooltip = useMemo(
    () => ownershipTooltip ?? getNothingToReportDisabledTooltip(selectedReports, t),
    [ownershipTooltip, selectedReports, t]
  );

  const handleDownload = useCallback(async () => {
    if (selectedReports.length === 0 || isDownloading) return;

    setIsDownloading(true);
    clearSelection();
    try {
      showEntityProgressToast(
        t,
        selectedReports.length === 1 ? t("Downloading report") : t("Downloading reports"),
        ENTITY_TOAST_IDS.downloading
      );
      const grouped = groupReportUuidsByEntity(selectedReports);
      for (const [entity, uuids] of Object.entries(grouped)) {
        if (uuids == null || uuids.length === 0) continue;
        await entityExportAll.downloadFile({
          pathParams: { entity: entity as SupportedEntity },
          queryParams: { uuids }
        });
      }
      completeEntityProgressToast(ENTITY_TOAST_IDS.downloading, t("Download Complete"));
    } catch (error) {
      Log.error("Failed to download selected reports", error);
      closeEntityProgressToast(ENTITY_TOAST_IDS.downloading);
      showEntityErrorToast(t("Error Downloading Reports"));
    } finally {
      setIsDownloading(false);
    }
  }, [clearSelection, isDownloading, selectedReports, t]);

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
      showToast({
        label: t('Your report(s) have been successfully marked as "Nothing to Report" for this reporting period'),
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
      showToast({
        label: t("Your report(s) have been successfully submitted and will be reviewed by the team"),
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
  }, [canSubmit, clearSelection, isUpdating, selectedReports.length, submittableReports, t, trackBulkActionSubmitted]);

  return {
    isDownloading,
    isUpdating,
    canEdit,
    editDisabledTooltip,
    canSubmit,
    canMarkNothingToReport,
    submitDisabledTooltip,
    nothingToReportDisabledTooltip,
    handleDownload,
    handleNothingToReport,
    handleSubmit
  };
};
