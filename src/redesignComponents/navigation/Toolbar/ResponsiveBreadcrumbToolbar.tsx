import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import Link from "next/link";
import { FC, forwardRef, useEffect, useState } from "react";

import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";

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

export interface BreadcrumbLink {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

export interface ResponsiveBreadcrumbToolbarProps {
  breadcrumbs: BreadcrumbLink[];
  suffix: React.ReactNode;
  className?: string;
  classNameSuffix?: string;
}

const CHAR_WIDTH_PX = 12;
const OVERHEAD_PER_CRUMB = 40;
const HORIZONTAL_PADDING = 32;
const DESKTOP_MAX_LABEL_LENGTH = 25;

const ResponsiveBreadcrumbToolbar: FC<ResponsiveBreadcrumbToolbarProps> = ({
  breadcrumbs,
  suffix,
  className = " gap-3 mobile:flex-col mobile:items-start",
  classNameSuffix = "mobile:w-full mobile:flex mobile:justify-end"
}) => {
  const t = useT();
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 390));

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breadcrumbCount = breadcrumbs.length || 1;
  const availableWidth = viewportWidth - HORIZONTAL_PADDING;
  const widthPerCrumb = availableWidth / breadcrumbCount - OVERHEAD_PER_CRUMB;
  const maxLabelLength = isMobile ? Math.max(2, Math.floor(widthPerCrumb / CHAR_WIDTH_PX)) : DESKTOP_MAX_LABEL_LENGTH;

  const translatedBreadcrumbs = breadcrumbs.map(link => ({
    label: link.label != null ? t(link.label) : "",
    link: link.link,
    icon: link.icon
  }));

  const truncatedBreadcrumbs = translatedBreadcrumbs.map(link => ({
    label:
      (link.label ?? "").length > maxLabelLength
        ? `${(link.label ?? "").slice(0, maxLabelLength)}...`
        : link.label ?? "",
    link: link.link,
    icon: link.icon
  }));

  return (
    <ToolbarObject
      breadcrumbs={{
        links: truncatedBreadcrumbs,
        linkRouter: NextLinkAdapter
      }}
      suffix={suffix}
      className={className}
      classNameSuffix={classNameSuffix}
    />
  );
};

export default ResponsiveBreadcrumbToolbar;
