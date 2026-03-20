import { FC } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";

import SiteHeader from "../../headers/PageHeaders/SiteHeader/SiteHeader";

export interface SiteBannerProps extends Omit<BannerProps, "children"> {
  site: SiteFullDto;
}

const SiteBanner: FC<SiteBannerProps> = ({ site, ...bannerProps }) => {
  console.log("Site", site);
  return (
    <Banner {...bannerProps}>
      <SiteHeader site={site} />
    </Banner>
  );
};

export default SiteBanner;
