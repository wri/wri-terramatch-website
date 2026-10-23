import { Box } from "@chakra-ui/react";
import { FC } from "react";

import ReportInfo, { ReportInfoProps } from "../components/ReportInfo";
import PageHeader from "../PageHeader";

export interface ReportHeaderProps extends ReportInfoProps {
  title: string;
}

const ReportHeader: FC<ReportHeaderProps> = ({ title, ...reportInfoProps }) => (
  <>
    <PageHeader title={title} />
    <Box gapX={4} px={6} py={5} justifyContent="space-between" className="mobile:flex-col">
      <ReportInfo {...reportInfoProps} />
    </Box>
  </>
);

export default ReportHeader;
