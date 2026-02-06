import { Box } from "@chakra-ui/react";
import { FC } from "react";

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
  tag: ProgressTagProps;
  organization: string;
  startDate: string;
  endDate: string;
  country: string;
  countryFlag: string;
  team: TeamMember[];
  toolbar: ViewToolbarProps;
}

const ProjectBanner: FC<ProjectBannerProps> = ({
  breadcrumbs,
  slots,
  title,
  tag,
  organization,
  startDate,
  endDate,
  country,
  countryFlag,
  team,
  toolbar
}) => {
  return (
    <Box>
      <ToolbarObject breadcrumbs={breadcrumbs} slots={slots} />
      <ProjectHeader
        title={title}
        tag={tag}
        organization={organization}
        startDate={startDate}
        endDate={endDate}
        country={country}
        countryFlag={countryFlag}
        team={team}
      />
      <ViewToolbar tabBar={toolbar.tabBar} />
    </Box>
  );
};

export default ProjectBanner;
