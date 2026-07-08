import { FC } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import { SiteHeaderProps } from "@/redesignComponents/content/headers/PageHeaders/SiteHeader/SiteHeader";

import SiteHeader from "../../headers/PageHeaders/SiteHeader/SiteHeader";

export interface SiteBannerProps
  extends Omit<BannerProps, "children">,
    Pick<SiteHeaderProps, "reviewLabel" | "showStatusTag"> {
  site: SiteFullDto;
}

const SiteBanner: FC<SiteBannerProps> = ({ site, reviewLabel, showStatusTag, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <SiteHeader site={site} reviewLabel={reviewLabel} showStatusTag={showStatusTag} />
  </Banner>
);

export default SiteBanner;
