import { Box } from "@chakra-ui/react";
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
        className={classNames("sticky top-[0px] z-20 border-b border-theme-neutral-300 px-1 sm:top-[70px]", className)}
      >
        <ToolbarObject
          breadcrumbs={{
            links: breadcrumbsWithTranslatedLabels.map(link => ({
              label: (link.label ?? "").length > 25 ? `${(link.label ?? "").slice(0, 25)}...` : link.label ?? "",
              link: link.link,
              icon: link.icon
            })),
            linkRouter: NextLinkAdapter
          }}
          suffix={suffix}
        />
      </Box>
      {children}
      <Box className="sticky top-[45px] z-20 border-b-4 border-theme-neutral-200 px-0.5 sm:top-[115px]">
        <ViewToolbar tabBar={toolbar.tabBar} />
      </Box>
    </>
  );
};

export default Banner;
