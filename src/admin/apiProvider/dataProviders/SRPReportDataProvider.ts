import { deleteSRPReport, loadFullSRPReport, loadSRPReportIndex } from "@/connections/Entity";

import { connectionDataProvider } from "../utils/listing";

// @ts-ignore
export const srpReportDataProvider = connectionDataProvider(
  "SRP report",
  loadSRPReportIndex,
  loadFullSRPReport,
  deleteSRPReport
);
