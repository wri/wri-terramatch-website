import { deleteSiteReport, loadFullSiteReport, loadSiteReportIndex } from "@/connections/Entity";

import { connectionDataProvider } from "../utils/listing";

export const siteReportDataProvider = connectionDataProvider(
  "Site report",
  loadSiteReportIndex,
  loadFullSiteReport,
  deleteSiteReport
);
