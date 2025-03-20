import { Stack } from "@mui/material";

import HighLevelMetics from "./HighLevelMetrics";
import NurseryOverview from "./NurseryOverview";
import NuseryQuickActions from "./QuickActions";

const NurseryInformationAside = () => {
  return (
    <Stack gap={2}>
      <NurseryOverview />

      <NuseryQuickActions />

      <HighLevelMetics />
    </Stack>
  );
};

export default NurseryInformationAside;
