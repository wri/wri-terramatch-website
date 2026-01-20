import styled from "@emotion/styled";
import { Breadcrumb as WriBreadcrumb } from "@worldresources/wri-design-systems";

export interface BreadcrumbProps {
  links: { label: string; link: string; icon?: React.ReactNode }[];
  separator?: React.ReactNode;
  maxItems?: number;
  linkRouter: any;
  size?: "small" | "default";
}

const StyledBreadcrumbWrapper = styled.div`
  p {
    color: #032230;
  }
`;

const Breadcrumb = (props: BreadcrumbProps) => {
  const { links = [], separator, maxItems, linkRouter, size } = props;

  return (
    <StyledBreadcrumbWrapper>
      <WriBreadcrumb links={links} separator={separator} maxItems={maxItems} linkRouter={linkRouter!} size={size} />
    </StyledBreadcrumbWrapper>
  );
};

export default Breadcrumb;
