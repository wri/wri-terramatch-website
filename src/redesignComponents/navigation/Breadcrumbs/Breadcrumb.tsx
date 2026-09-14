import styled from "@emotion/styled";
import { Breadcrumb as WriBreadcrumb } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

export interface BreadcrumbProps {
  links: { label: string; link: string; icon?: React.ReactNode }[];
  separator?: React.ReactNode;
  maxItems?: number;
  linkRouter: any;
  size?: "small" | "default";
  className?: string;
}

// Breadcrumbs stay on a SINGLE line — the design system's Storybook only ever shows single-line
// breadcrumbs, and a long crumb (e.g. a long project name) must truncate with an ellipsis rather than
// wrap to multiple lines. Applied to the label elements the DS renders: each non-final crumb is the
// linkRouter's <a>, the final crumb is a <p aria-current="page">; both hold the label as a text child.
const StyledBreadcrumbWrapper = styled.div`
  ol,
  ul {
    flex-wrap: nowrap;
  }

  a,
  p {
    color: ${getThemedColor("primary", 900)} !important;
    display: inline-block;
    max-width: 32ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;

    svg {
      color: ${getThemedColor("primary", 900)} !important;
    }
  }
`;

const Breadcrumb: FC<BreadcrumbProps> = props => {
  const { links = [], separator, maxItems, linkRouter, size, className } = props;

  return (
    <StyledBreadcrumbWrapper className={className}>
      <WriBreadcrumb links={links} separator={separator} maxItems={maxItems} linkRouter={linkRouter!} size={size} />
    </StyledBreadcrumbWrapper>
  );
};

export default Breadcrumb;
