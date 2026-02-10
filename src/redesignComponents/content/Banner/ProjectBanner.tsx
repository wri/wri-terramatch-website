import { Box } from "@chakra-ui/react";
import classNames from "classnames";
import Link from "next/link";
import { FC, forwardRef } from "react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ViewToolbarProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ViewToolbar from "@/redesignComponents/navigation/Toolbar/ViewToolbar";

import ProjectHeader from "../headers/PageHeaders/ProjectHeader";

export interface ProjectBannerProps {
  breadcrumbs: { label: string; link: string; icon?: React.ReactNode }[];
  suffix: React.ReactNode;
  toolbar: ViewToolbarProps;
  project: ProjectFullDto;
  className?: string;
}

const ProjectBanner: FC<ProjectBannerProps> = ({ breadcrumbs, suffix, toolbar, project, className }) => {
  const NextLinkAdapter = forwardRef<HTMLAnchorElement, { to: string; children: React.ReactNode; className?: string }>(
    ({ to, children, className, ...props }, ref) => (
      <Link href={to} ref={ref} className={className} {...props}>
        {children}
      </Link>
    )
  );
  NextLinkAdapter.displayName = "NextLinkAdapter";
  return (
    <>
      <Box className={classNames("border-theme-neutral-300 sticky z-50 border-b px-1", className)}>
        <ToolbarObject
          breadcrumbs={{
            links: breadcrumbs.map(link => ({
              label: link.label,
              link: link.link,
              icon: link.icon
            })),
            linkRouter: NextLinkAdapter
          }}
          suffix={suffix}
        />
      </Box>
      <ProjectHeader project={project} />
      <Box className="border-theme-neutral-200 sticky top-[115px] z-50 border-b-4 px-0.5">
        <ViewToolbar tabBar={toolbar.tabBar} />
      </Box>
    </>
  );
};

export default ProjectBanner;
