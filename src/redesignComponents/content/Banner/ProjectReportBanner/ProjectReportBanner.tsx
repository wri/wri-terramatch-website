import { FC } from "react";

import { ProjectReportFullDto, TaskFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import ProjectReportHeader from "@/redesignComponents/content/headers/PageHeaders/ProjectReportHeader/ProjectReportHeader";

export interface ProjectReportBannerProps extends Omit<BannerProps, "children"> {
  report: ProjectReportFullDto;
  title: string;
  task?: TaskFullDto;
}

const ProjectReportBanner: FC<ProjectReportBannerProps> = ({ report, title, task, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <ProjectReportHeader report={report} title={title} task={task} />
  </Banner>
);

export default ProjectReportBanner;
