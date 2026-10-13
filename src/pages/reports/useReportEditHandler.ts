import { useT } from "@transifex/react";
import type { ParsedUrlQuery } from "querystring";
import { useCallback } from "react";

import { useMyOrg } from "@/connections/Organisation";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
import { isReportOwnedByOtherOrg } from "@/utils/reportOwnership";

import type { ReportIndexItem } from "./reportIndex.types";
import { rememberReportsIndexPosition } from "./reportIndex.utils";
import { useReportProfileOrigin } from "./ReportProfileOrigin.provider";

export const useReportEditHandler = (report: ReportIndexItem, indexHref?: string) => {
  const t = useT();
  const [, myOrg] = useMyOrg();
  const isAdmin = useIsAdmin();
  const profileOrigin = useReportProfileOrigin();
  const originQuery: ParsedUrlQuery = {
    from: indexHref,
    profile: profileOrigin?.source,
    profileUuid: profileOrigin?.uuid,
    origin: profileOrigin?.contextOrigin
  };
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: `${report.type}s`,
    entityUUID: report.id,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus,
    entityTitle: report.name ?? "",
    useStatusModal: true,
    useInformationRequiredModal: report.nothingToReport !== true,
    originQuery
  });

  const editReport = useCallback(() => {
    // Financial reports belong to an organisation: members of other organisations get a toast instead of the report.
    if (report.type === "financial-report" && "organisationUuid" in report) {
      const owner = { uuid: report.organisationUuid, name: report.organisationName };
      if (isReportOwnedByOtherOrg(owner, myOrg?.organisationId, isAdmin)) {
        showToast({
          label: t("This report belongs to {organizationName}. Only its members can edit or submit it.", {
            organizationName: owner.name ?? ""
          }),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        return;
      }
    }
    rememberReportsIndexPosition(indexHref, report.id, "projectUuid" in report ? report.projectUuid : undefined);
    handleEdit();
  }, [handleEdit, indexHref, isAdmin, myOrg?.organisationId, report, t]);

  return { editReport, EditModals };
};
