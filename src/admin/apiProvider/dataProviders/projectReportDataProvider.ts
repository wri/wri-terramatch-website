import { deleteProjectReport, loadFullProjectReport, loadProjectReportIndex } from "@/connections/Entity";

import { connectionDataProvider } from "../utils/listing";

export const projectReportDataProvider = connectionDataProvider(
  "Project report",
  loadProjectReportIndex,
  loadFullProjectReport,
  deleteProjectReport
);
