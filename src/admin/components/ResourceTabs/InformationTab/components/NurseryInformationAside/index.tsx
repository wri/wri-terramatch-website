import { Stack } from "@mui/material";

import HighLevelMetics from "./HighLevelMetrics";
import NurseryOverview from "./NurseryOverview";
import QuickActions from "./QuickActions";

const NurseryInformationAside = () => {
  return (
    <Stack gap={2}>
      <NurseryOverview />

      <QuickActions />

      <HighLevelMetics />
    </Stack>
  );
};

export default NurseryInformationAside;
