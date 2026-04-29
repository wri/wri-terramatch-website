import { Box } from "@chakra-ui/react";
import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { FC, forwardRef } from "react";

import { ViewToolbarProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ViewToolbar from "@/redesignComponents/navigation/Toolbar/ViewToolbar";

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

export interface BannerProps {
  breadcrumbs: { label: string; link: string; icon?: React.ReactNode }[];
  suffix: React.ReactNode;
  toolbar: ViewToolbarProps;
  className?: string;
  children?: React.ReactNode;
}

const Banner: FC<BannerProps> = ({ breadcrumbs, suffix, toolbar, className, children }) => {
  const t = useT();
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const maxLabelLength = isMobile ? 18 : 25;
  const breadcrumbsWithTranslatedLabels = breadcrumbs.map(link => {
    return {
      label: link.label != null ? t(link.label) : "",
      link: link.link,
      icon: link.icon
    };
  });
  return (
    <>
      <Box
        borderBottom="0.0625rem solid"
        borderColor="neutral.300"
        className={classNames("sticky top-[0] z-20 px-1", className)}
      >
        <ToolbarObject
          breadcrumbs={{
            links: breadcrumbsWithTranslatedLabels.map(link => ({
              label:
                (link.label ?? "").length > maxLabelLength
                  ? `${(link.label ?? "").slice(0, maxLabelLength)}...`
                  : link.label ?? "",
              link: link.link,
              icon: link.icon
            })),
            linkRouter: NextLinkAdapter
          }}
          suffix={suffix}
          className=" gap-3 mobile:flex-col mobile:items-start"
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
