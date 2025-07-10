import { useT } from "@transifex/react";

import StatusBar from "@/components/elements/StatusBar/StatusBar";

interface FinancialReportStatusBarProps {
  financialReport: any;
}

const FinancialReportStatusBar = ({ financialReport }: FinancialReportStatusBarProps) => {
  const t = useT();

  const reportStatus = financialReport?.status;

  if (!reportStatus) return null;

  const getStatusConfig = (status: string) => {
    const statusConfigMapping: any = {
      due: {
        title: t("Status: Due")
      },
      started: {
        title: t("Status: Started")
      },
      submitted: {
        title: t("Status: Submitted")
      }
    };
    return statusConfigMapping[status]?.title ?? statusConfigMapping.started?.title;
  };

  return <StatusBar title={getStatusConfig(reportStatus)} status={reportStatus} />;
};

export default FinancialReportStatusBar;
