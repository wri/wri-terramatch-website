import { Stack } from "@mui/material";

import HighLevelMetrics from "./HighLevelMetrics";
import QuickActions from "./QuickActions";
import SiteOverview from "./SiteOverview";

const SiteInformationAside = () => {
  return (
    <Stack gap={2} className="h-full border-l border-grey-740">
      <SiteOverview />
      <QuickActions />
      <HighLevelMetrics />
    </Stack>
  );
};

export default SiteInformationAside;
