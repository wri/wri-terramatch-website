import { deleteFinancialReport, loadFinancialReportIndex, loadFullFinancialReport } from "@/connections/Entity";

import { connectionDataProvider } from "../utils/listing";

// @ts-ignore
export const financialReportDataProvider = connectionDataProvider(
  "Financial report",
  loadFinancialReportIndex,
  loadFullFinancialReport,
  deleteFinancialReport
);
