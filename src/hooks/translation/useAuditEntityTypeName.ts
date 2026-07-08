import { useT } from "@transifex/react";
import { useMemo } from "react";

import { AuditStatusEntityType } from "@/connections/AuditStatus";

export const useAuditEntityTypeName = () => {
  const t = useT();
  return useMemo((): Record<AuditStatusEntityType, string> => {
    return {
      sitePolygons: t("Polygon"),
      projects: t("Project"),
      sites: t("Site"),
      nurseries: t("Nursery"),
      projectReports: t("Project Report"),
      siteReports: t("Site Report"),
      nurseryReports: t("Nursery Report"),
      disturbanceReports: t("Disturbance Report"),
      srpReports: t("Srp Report"),
      financialReports: t("Financial Report")
    };
  }, [t]);
};
