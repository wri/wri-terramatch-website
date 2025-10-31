import { deleteSRPReport, loadSRPReportIndex, loadFullSRPReport } from "@/connections/Entity";

import { connectionDataProvider } from "../utils/listing";

// @ts-ignore
export const srpReportDataProvider = connectionDataProvider(
  "SRP report",
  loadSRPReportIndex,
  loadFullSRPReport,
  deleteSRPReport
);
