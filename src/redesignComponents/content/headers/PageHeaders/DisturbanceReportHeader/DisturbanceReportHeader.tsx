import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import DisturbanceSeverity from "../components/DisturbanceSeverity";
import ReportInfo from "../components/ReportInfo";
import PageHeader from "../PageHeader";

export interface DisturbanceReportHeaderProps {
  report: DisturbanceReportFullDto;
  title: string;
}

const DisturbanceReportHeader: FC<DisturbanceReportHeaderProps> = ({ report, title }) => (
  <>
    <PageHeader title={title} />
    <Box display="flex" gap={4} px={6} py={5} justifyContent="space-between" className="mobile:flex-col">
      <ReportInfo report={report} dueAt={report.dueAt} entityName="disturbance-report" />
      <DisturbanceSeverity report={report} />
    </Box>
  </>
);

export default DisturbanceReportHeader;
