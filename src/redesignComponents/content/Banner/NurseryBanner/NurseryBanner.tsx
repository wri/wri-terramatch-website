import { FC } from "react";

import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import NurseryHeader from "@/redesignComponents/content/headers/PageHeaders/NurseryHeader/NurseryHeader";

import PageHeader from "../../headers/PageHeaders/PageHeader";

export interface NurseryBannerProps extends Omit<BannerProps, "children"> {
  nursery: NurseryFullDto;
}

const NurseryBanner: FC<NurseryBannerProps> = ({ nursery, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <PageHeader title={nursery.name ?? ""} />
    <NurseryHeader nursery={nursery} />
    {(nursery.updateRequestStatus === "needs-more-information" ||
      (nursery.updateRequestStatus == "no-update" && nursery.status === "needs-more-information")) && (
      <EntityStatusBar entity={nursery} entityName="nurseries" />
    )}
  </Banner>
);

export default NurseryBanner;
