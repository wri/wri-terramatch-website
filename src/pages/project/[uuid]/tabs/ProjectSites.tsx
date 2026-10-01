import { FC } from "react";

import type { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

type ProjectSitesTabProps = {
  project: ProjectFullDto;
};

/** Placeholder until the project Sites index tab (separate ticket) ships. */
const ProjectSitesTab: FC<ProjectSitesTabProps> = () => null;

export default ProjectSitesTab;
