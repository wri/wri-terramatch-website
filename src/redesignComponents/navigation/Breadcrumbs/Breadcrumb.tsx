import { Breadcrumb as WriBreadcrumb } from "@worldresources/wri-design-systems";

export interface BreadcrumbProps {
  links: { label: string; link: string; icon?: React.ReactNode }[];
  separator?: React.ReactNode;
  maxItems?: number;
  linkRouter: any; // Link from react router or next.js
  size?: "small" | "default";
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { links = [], separator, maxItems, linkRouter, size } = props;

  return <WriBreadcrumb links={links} separator={separator} maxItems={maxItems} linkRouter={linkRouter!} size={size} />;
};

export default Breadcrumb;
