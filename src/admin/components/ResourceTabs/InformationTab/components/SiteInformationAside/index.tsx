import { Stack } from "@mui/material";

import HighLevelMetics from "./HighLevelMetrics";
import QuickActions from "./QuickActions";
import SiteOverview from "./SiteOverview";

const SiteInformationAside = () => {
  return (
    <Stack gap={2} className="h-full border-l border-grey-740">
      <SiteOverview />
      <QuickActions />
      <HighLevelMetics />
    </Stack>
  );
};

export default SiteInformationAside;
