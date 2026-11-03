import { FC } from "react";

import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";

import DisturbanceReportHeader from "../../headers/PageHeaders/DisturbanceReportHeader/DisturbanceReportHeader";

export interface DisturbanceReportBannerProps extends Omit<BannerProps, "children"> {
  report: DisturbanceReportFullDto;
  title: string;
}

const DisturbanceReportBanner: FC<DisturbanceReportBannerProps> = ({ report, title, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <DisturbanceReportHeader report={report} title={title} />
  </Banner>
);

export default DisturbanceReportBanner;
