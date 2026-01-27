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
}

const StyledBreadcrumbWrapper = styled.div`
  p {
    color: ${getThemedColor("primary", 900)} !important;
    svg {
      color: ${getThemedColor("primary", 900)} !important;
    }
  }
`;

const Breadcrumb: FC<BreadcrumbProps> = props => {
  const { links = [], separator, maxItems, linkRouter, size } = props;

  return (
    <StyledBreadcrumbWrapper>
      <WriBreadcrumb links={links} separator={separator} maxItems={maxItems} linkRouter={linkRouter!} size={size} />
    </StyledBreadcrumbWrapper>
  );
};

export default Breadcrumb;
