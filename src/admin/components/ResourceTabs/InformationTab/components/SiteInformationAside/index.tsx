import { Stack } from "@mui/material";

import HighLevelMetrics from "./HighLevelMetrics";
import SiteQuickActions from "./QuickActions";
import SiteOverview from "./SiteOverview";

const SiteInformationAside = () => {
  return (
    <Stack gap={2} className="h-full border-l border-grey-740">
      <SiteOverview />
      <SiteQuickActions />
      <HighLevelMetrics />
    </Stack>
  );
};

export default SiteInformationAside;
