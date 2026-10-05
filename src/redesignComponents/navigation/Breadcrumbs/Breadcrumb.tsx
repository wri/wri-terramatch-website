import styled from "@emotion/styled";
import { Breadcrumb as WriBreadcrumb } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";
import { useMemo } from "react";

import useBreadcrumbContext from "@/hooks/useBreadcrumbContext";
import { getThemedColor } from "@/lib/theme";

export interface BreadcrumbLink {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends Omit<ComponentProps<typeof WriBreadcrumb>, "links"> {
  links?: BreadcrumbLink[];
  separator?: React.ReactNode;
  maxItems?: number;
  linkRouter: ComponentProps<typeof WriBreadcrumb>["linkRouter"];
  size?: "small" | "default";
  className?: string;
  // Context-aware mode
  label?: string;
  link?: string;
  icon?: React.ReactNode;
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
  const { links: hardcodedLinks, separator, maxItems, linkRouter, size, className, label, link, icon } = props;

  const context = useBreadcrumbContext();

  const links = useMemo(() => {
    if (label != null && link != null) {
      const breadcrumbs: BreadcrumbLink[] = [];
      const currentItem = { label, link, icon };

      if (context.contextType === "site" && context.projectUuid) {
        breadcrumbs.push({ label: "Projects", link: "/my-projects" });
        if (context.projectName) {
          breadcrumbs.push({
            label: context.projectName,
            link: `/project/${context.projectUuid}`
          });
        }
        if (context.siteUuid && context.siteName) {
          breadcrumbs.push({
            label: context.siteName,
            link: `/site/${context.siteUuid}`
          });
        }
      } else if (context.contextType === "nursery" && context.projectUuid) {
        breadcrumbs.push({ label: "Projects", link: "/my-projects" });
        if (context.projectName) {
          breadcrumbs.push({
            label: context.projectName,
            link: `/project/${context.projectUuid}`
          });
        }
        breadcrumbs.push({
          label: "Nurseries",
          link: `/project/${context.projectUuid}?tab=nurseries`
        });
        if (context.nurseryUuid && context.nurseryName) {
          breadcrumbs.push({
            label: context.nurseryName,
            link: `/nurserie/${context.nurseryUuid}`
          });
        }
      } else if (context.contextType === "project" && context.projectUuid) {
        breadcrumbs.push({ label: "Projects", link: "/my-projects" });
        if (context.projectName) {
          breadcrumbs.push({
            label: context.projectName,
            link: `/project/${context.projectUuid}`
          });
        }
      }

      breadcrumbs.push(currentItem);
      return breadcrumbs;
    }

    return hardcodedLinks ?? [];
  }, [context, label, link, icon, hardcodedLinks]);

  return (
    <StyledBreadcrumbWrapper className={className}>
      <WriBreadcrumb links={links} separator={separator} maxItems={maxItems} linkRouter={linkRouter} size={size} />
    </StyledBreadcrumbWrapper>
  );
};

export default Breadcrumb;
