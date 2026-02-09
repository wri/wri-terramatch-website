import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { BreadcrumbProps } from "@/redesignComponents/navigation/Breadcrumbs/Breadcrumb";
import { ViewToolbarProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ViewToolbar from "@/redesignComponents/navigation/Toolbar/ViewToolbar";

import { TeamMember } from "../headers/PageHeaders/components/TeamSection";
import ProjectHeader from "../headers/PageHeaders/ProjectHeader";

export interface ProjectBannerProps {
  breadcrumbs: BreadcrumbProps;
  suffix: React.ReactNode;
  title: string;
  description?: string | undefined | null;
  tag: ProgressTagProps;
  organization: string;
  startDate: string;
  endDate: string;
  country: string;
  countryFlag: string;
  team: TeamMember[];
  toolbar: ViewToolbarProps;
  project: ProjectFullDto;
}

const ProjectBanner: FC<ProjectBannerProps> = ({
  breadcrumbs,
  suffix,
  title,
  tag,
  description,
  organization,
  startDate,
  endDate,
  country,
  countryFlag,
  team,
  toolbar,
  project
}) => {
  return (
    <>
      <Box className="border-theme-neutral-300 sticky top-[70px] z-50 border-b px-1">
        <ToolbarObject breadcrumbs={breadcrumbs} suffix={suffix} />
      </Box>
      <ProjectHeader
        project={project}
        title={title}
        tag={tag}
        organization={organization}
        startDate={startDate}
        endDate={endDate}
        country={country}
        countryFlag={countryFlag}
        team={team}
        description={description ?? undefined}
      />
      <Box className="border-theme-neutral-200 sticky top-[115px] z-50 border-b-4 px-0.5">
        <ViewToolbar tabBar={toolbar.tabBar} />
      </Box>
    </>
  );
};

export default ProjectBanner;
