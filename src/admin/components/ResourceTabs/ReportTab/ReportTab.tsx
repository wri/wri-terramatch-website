import { FC } from "react";
import { TabbedShowLayout, useShowContext } from "react-admin";
import { When } from "react-if";

import ReportContent from "./components/ReportContent";
import { usePrintHandler } from "./hooks/usePrintHandler";
import { useReportData } from "./hooks/useReportData";
import { ReportTabProps } from "./types";

/**
 * ReportTab Component
 * Displays comprehensive project report data in a printable format
 */
const ReportTab: FC<ReportTabProps> = ({ label, type, ...rest }) => {
  const ctx = useShowContext();

  // Custom hooks for handling data and print functionality
  const { sites, plants, employmentData, beneficiaryData, reportData, isLoading } = useReportData();
  const { addDebugPrintButton } = usePrintHandler();

  // Add debug print button in development mode
  addDebugPrintButton();

  return (
    <When condition={!isLoading && !ctx.isLoading}>
      <TabbedShowLayout.Tab style={{ flexDirection: "row", minHeight: "unset" }} label={label ?? "Reports"} {...rest}>
        <ReportContent
          sites={sites}
          plants={plants ?? []}
          employmentData={employmentData}
          beneficiaryData={beneficiaryData}
          reportData={reportData}
        />
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default ReportTab;
