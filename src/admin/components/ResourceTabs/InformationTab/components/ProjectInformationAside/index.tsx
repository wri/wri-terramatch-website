import { Stack } from "@mui/material";

import HighLevelMetrics from "./HighLevelMetrics";
import ProjectOverview from "./ProjectOverview";
import QuickActions from "./QuickActions";

const ProjectInformationAside = () => (
  <Stack gap={2}>
    <ProjectOverview />
    <QuickActions />
    <HighLevelMetrics />
  </Stack>
);

export default ProjectInformationAside;
