import { FC } from "react";
import { TabbedShowLayout, useShowContext } from "react-admin";

import ReportContent from "./components/ReportContent";
import { usePrintHandler } from "./hooks/usePrintHandler";
import { useReportData } from "./hooks/useReportData";
import { ReportTabProps } from "./types";

const ReportTab: FC<ReportTabProps> = ({ label, type, ...rest }) => {
  const ctx = useShowContext();
  const { sites, plants, beneficiaryData, reportData, isLoading } = useReportData();
  usePrintHandler();

  return isLoading || ctx.isLoading ? null : (
    <TabbedShowLayout.Tab style={{ flexDirection: "row", minHeight: "unset" }} label={label ?? "Reports"} {...rest}>
      <ReportContent sites={sites} plants={plants ?? []} beneficiaryData={beneficiaryData} reportData={reportData} />
    </TabbedShowLayout.Tab>
  );
};

export default ReportTab;
