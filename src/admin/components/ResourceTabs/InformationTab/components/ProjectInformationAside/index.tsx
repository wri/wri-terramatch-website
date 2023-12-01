import { Stack } from "@mui/material";

import HighLevelMetics from "./HighLevelMetrics";
import ProjectOverview from "./ProjectOverview";
import QuickActions from "./QuickActions";

const ProjectInformationAside = () => {
  return (
    <Stack gap={2}>
      <ProjectOverview />
      <QuickActions />
      <HighLevelMetics />
    </Stack>
  );
};

export default ProjectInformationAside;
