import { FC } from "react";

import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";

import OrganisationHeader, {
  OrganisationHeaderProps
} from "../../headers/PageHeaders/OrganisationHeader/OrganisationHeader";

export interface OrganisationBannerProps extends Omit<BannerProps, "children"> {
  header: OrganisationHeaderProps;
}

const OrganisationBanner: FC<OrganisationBannerProps> = ({ header, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <OrganisationHeader {...header} />
  </Banner>
);

export default OrganisationBanner;
