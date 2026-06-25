import { Box } from "@chakra-ui/react";
import classNames from "classnames";
import { FC } from "react";

import ResponsiveBreadcrumbToolbar, {
  BreadcrumbLink
} from "@/redesignComponents/navigation/Toolbar/ResponsiveBreadcrumbToolbar";
import { ViewToolbarProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ViewToolbar from "@/redesignComponents/navigation/Toolbar/ViewToolbar";

export interface BannerProps {
  breadcrumbs: BreadcrumbLink[];
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
        <ResponsiveBreadcrumbToolbar breadcrumbs={breadcrumbs} suffix={suffix} />
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
