import { deleteNurseryReport, loadFullNurseryReport, loadNurseryReportIndex } from "@/connections/Entity";

import { connectionDataProvider } from "../utils/listing";

export const nurseryReportDataProvider = connectionDataProvider(
  "Nursery report",
  loadNurseryReportIndex,
  loadFullNurseryReport,
  deleteNurseryReport
);
