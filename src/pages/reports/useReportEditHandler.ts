import { useCallback } from "react";

import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";

import type { ReportIndexItem } from "./reportIndex.types";
import { rememberReportsIndexPosition } from "./reportIndex.utils";

export const useReportEditHandler = (report: ReportIndexItem, indexHref?: string) => {
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: `${report.type}s`,
    entityUUID: report.id,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus,
    entityTitle: report.name ?? "",
    useStatusModal: true,
    useInformationRequiredModal: report.nothingToReport !== true
  });

  const editReport = useCallback(() => {
    rememberReportsIndexPosition(indexHref, report.id, "projectUuid" in report ? report.projectUuid : undefined);
    handleEdit();
  }, [handleEdit, indexHref, report]);

  return { editReport, EditModals };
};
