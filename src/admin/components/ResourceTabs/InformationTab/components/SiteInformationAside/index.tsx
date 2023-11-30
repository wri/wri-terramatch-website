import { Stack } from "@mui/material";

import HighLevelMetics from "./HighLevelMetrics";
import QuickActions from "./QuickActions";
import SiteOverview from "./SiteOverview";

const SiteInformationAside = () => {
  return (
    <Stack gap={2}>
      <SiteOverview />
      <QuickActions />
      <HighLevelMetics />
    </Stack>
  );
};

export default SiteInformationAside;
