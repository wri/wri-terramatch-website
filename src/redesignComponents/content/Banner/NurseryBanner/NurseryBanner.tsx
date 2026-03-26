import { FC } from "react";

import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import NurseryHeader from "@/redesignComponents/content/headers/PageHeaders/NurseryHeader/NurseryHeader";

export interface NurseryBannerProps extends Omit<BannerProps, "children"> {
  nursery: NurseryFullDto;
}

const NurseryBanner: FC<NurseryBannerProps> = ({ nursery, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <NurseryHeader nursery={nursery} />
  </Banner>
);

export default NurseryBanner;
