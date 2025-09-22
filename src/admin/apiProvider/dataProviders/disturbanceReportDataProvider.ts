import { deleteDisturbanceReport, loadDisturbanceReportIndex, loadFullDisturbanceReport } from "@/connections/Entity";

import { connectionDataProvider } from "../utils/listing";

// @ts-ignore
export const disturbanceReportDataProvider = connectionDataProvider(
  "Disturbance report",
  loadDisturbanceReportIndex,
  loadFullDisturbanceReport,
  deleteDisturbanceReport
);
