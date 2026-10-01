import { Flex, useMediaQuery } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useEffect, useState } from "react";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Toolbar from "./Toolbar";
import { ToolbarObjectProps } from "./ToolBar.type";

const CHAR_WIDTH_PX = 12;
const OVERHEAD_PER_CRUMB = 40;
const HORIZONTAL_PADDING = 32;
const DESKTOP_MAX_LABEL_LENGTH = 25;

const ToolbarObject: FC<ToolbarObjectProps> = ({ breadcrumbs, suffix, className, classNameSuffix }) => {
  const t = useT();
  const [isMobile] = useMediaQuery(["(max-width: 1200px)"], { fallback: [false] });
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 390));

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breadcrumbCount = Math.max(1, breadcrumbs.links.length);
  const availableWidth = viewportWidth - HORIZONTAL_PADDING;
  const widthPerCrumb = availableWidth / breadcrumbCount - OVERHEAD_PER_CRUMB;
  const maxLabelLength = isMobile ? Math.max(2, Math.floor(widthPerCrumb / CHAR_WIDTH_PX)) : DESKTOP_MAX_LABEL_LENGTH;

  const truncatedBreadcrumbs = breadcrumbs.links.map(link => {
    const label = t(link.label);
    return {
      ...link,
      label: label.length > maxLabelLength ? `${label.slice(0, maxLabelLength)}...` : label
    };
  });

  return (
    <Toolbar
      className={classNames("border-b border-theme-neutral-300 px-5 py-2", className)}
      contentLeft={<Breadcrumb {...breadcrumbs} links={truncatedBreadcrumbs} />}
      contentRight={
        suffix != null ? <Flex className={"flex-row-reverse items-center gap-3"}>{suffix}</Flex> : undefined
      }
      classNameContentRight={classNameSuffix}
    />
  );
};

export default ToolbarObject;
