import { FC } from "react";

import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";

import ProjectHeader from "../../headers/PageHeaders/ProjectHeader/ProjectHeader";

export interface ProjectBannerProps extends Omit<BannerProps, "children"> {
  project: ProjectFullDto;
  onAddTeamClick: () => void;
  gotoTeamMembers: () => void;
}

const ProjectBanner: FC<ProjectBannerProps> = ({ project, onAddTeamClick, gotoTeamMembers, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <ProjectHeader project={project} onAddTeamClick={onAddTeamClick} gotoTeamMembers={gotoTeamMembers} />
    {(project.status == "needs-more-information" || project.updateRequestStatus == "needs-more-information") && (
      <EntityStatusBar entity={project} entityName="projects" />
    )}
  </Banner>
);

export default ProjectBanner;
