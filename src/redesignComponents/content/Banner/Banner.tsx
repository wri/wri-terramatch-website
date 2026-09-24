import { Box } from "@chakra-ui/react";
import classNames from "classnames";
import { FC } from "react";

import { BreadcrumbProps } from "@/redesignComponents/navigation/Breadcrumbs/Breadcrumb";
import NextLinkAdapter from "@/redesignComponents/navigation/Breadcrumbs/NextLinkAdapter";
import { ViewToolbarProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ViewToolbar from "@/redesignComponents/navigation/Toolbar/ViewToolbar";

export interface BannerProps {
  breadcrumbs: BreadcrumbProps["links"];
  suffix: React.ReactNode;
  toolbar: ViewToolbarProps;
  className?: string;
  children?: React.ReactNode;
}

const Banner: FC<BannerProps> = ({ breadcrumbs, suffix, toolbar, className, children }) => {
  return (
    <>
      <Box
        borderBottom="0.0625rem solid"
        borderColor="neutral.300"
        className={classNames("sticky top-[0] z-20 px-1", className)}
      >
        <ToolbarObject
          breadcrumbs={{ links: breadcrumbs, linkRouter: NextLinkAdapter }}
          suffix={suffix}
          className="gap-3 mobile:flex-col mobile:items-start"
          classNameSuffix="mobile:w-full mobile:flex mobile:justify-end"
        />
      </Box>
      {children}
      <Box
        borderBottom="0.25rem solid"
        borderColor="neutral.200"
        className="sticky top-[2.8125rem] z-20 px-0.5 mobile:top-[5.0625rem]"
      >
        <ViewToolbar tabBar={toolbar.tabBar} />
      </Box>
    </>
  );
};

export default Banner;
