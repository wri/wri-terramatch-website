import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { BreadcrumbProps } from "@/redesignComponents/navigation/Breadcrumbs/Breadcrumb";
import { ToolbarSlot, ViewToolbarProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ViewToolbar from "@/redesignComponents/navigation/Toolbar/ViewToolbar";

import { TeamMember } from "../headers/PageHeaders/components/TeamSection";
import ProjectHeader from "../headers/PageHeaders/ProjectHeader";

export interface ProjectBannerProps {
  breadcrumbs: BreadcrumbProps;
  slots: ToolbarSlot[];
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
  slots,
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
    <Box>
      <Box className="sticky top-0 px-0.5">
        <ToolbarObject breadcrumbs={breadcrumbs} slots={slots} />
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
        description={description}
      />
      <Box className="sticky top-9 px-0.5">
        <ViewToolbar tabBar={toolbar.tabBar} />
      </Box>
    </Box>
  );
};

export default ProjectBanner;
