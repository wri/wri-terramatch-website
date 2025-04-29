import { FC } from "react";
import { TabbedShowLayout, useShowContext } from "react-admin";
import { When } from "react-if";

import ReportContent from "./components/ReportContent";
import { usePrintHandler } from "./hooks/usePrintHandler";
import { useReportData } from "./hooks/useReportData";
import { ReportTabProps } from "./types";

const ReportTab: FC<ReportTabProps> = ({ label, type, ...rest }) => {
  const ctx = useShowContext();

  const { sites, plants, beneficiaryData, reportData, isLoading } = useReportData();
  // Importamos el hook pero solo para mantener la funcionalidad de impresión con Ctrl+P/Cmd+P
  usePrintHandler();

  return (
    <When condition={!isLoading && !ctx.isLoading}>
      <TabbedShowLayout.Tab style={{ flexDirection: "row", minHeight: "unset" }} label={label ?? "Reports"} {...rest}>
        <ReportContent sites={sites} plants={plants ?? []} beneficiaryData={beneficiaryData} reportData={reportData} />
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default ReportTab;
