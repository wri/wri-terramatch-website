import { Stack } from "@mui/material";

import HighLevelMetrics from "./HighLevelMetrics";
import QuickActions from "./QuickActions";
import ReportOverview from "./ReportOverview";

const SRPReportAside = () => {
  return (
    <Stack gap={2} className="h-full border-l border-grey-740">
      <ReportOverview />
      <QuickActions />
      <HighLevelMetrics />
    </Stack>
  );
};

export default SRPReportAside;
