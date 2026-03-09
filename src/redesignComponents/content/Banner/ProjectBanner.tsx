import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { FC, forwardRef } from "react";

import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ViewToolbarProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ViewToolbar from "@/redesignComponents/navigation/Toolbar/ViewToolbar";

import ProjectHeader from "../headers/PageHeaders/ProjectHeader";

interface NextLinkAdapterProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NextLinkAdapter = forwardRef<HTMLAnchorElement, NextLinkAdapterProps>(
  ({ to, children, className, ...props }, ref) => (
    <Link href={to} ref={ref} className={className} {...props}>
      {children}
    </Link>
  )
);

NextLinkAdapter.displayName = "NextLinkAdapter";

export interface ProjectBannerProps {
  breadcrumbs: { label: string; link: string; icon?: React.ReactNode }[];
  suffix: React.ReactNode;
  toolbar: ViewToolbarProps;
  project: ProjectFullDto;
  className?: string;
  onAddTeamClick: () => void;
  gotoTeamMembers: () => void;
}

const ProjectBanner: FC<ProjectBannerProps> = ({
  breadcrumbs,
  suffix,
  toolbar,
  project,
  className,
  onAddTeamClick,
  gotoTeamMembers
}) => {
  const t = useT();

  return (
    <>
      <Box className={classNames("sticky z-20 border-b border-theme-neutral-300 px-1", className)}>
        <ToolbarObject
          breadcrumbs={{
            links: breadcrumbs.map(link => ({
              label: t(link.label),
              link: link.link,
              icon: link.icon
            })),
            linkRouter: NextLinkAdapter
          }}
          suffix={suffix}
        />
      </Box>
      <ProjectHeader project={project} onAddTeamClick={onAddTeamClick} gotoTeamMembers={gotoTeamMembers} />
      {(project.status == "needs-more-information" || project.updateRequestStatus == "needs-more-information") && (
        <EntityStatusBar entity={project} entityName="projects" />
      )}
      <Box className="sticky top-[115px] z-20 border-b-4 border-theme-neutral-200 px-0.5">
        <ViewToolbar tabBar={toolbar.tabBar} />
      </Box>
    </>
  );
};

export default ProjectBanner;
