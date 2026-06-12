import { FC } from "react";

import { ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import ReportHeader from "@/redesignComponents/content/headers/PageHeaders/ReportHeader/ReportHeader";

export interface ReportBannerProps extends Omit<BannerProps, "children"> {
  report: ProjectReportFullDto;
  title: string;
}

const ReportBanner: FC<ReportBannerProps> = ({ report, title, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <ReportHeader report={report} title={title} />
  </Banner>
);

export default ReportBanner;
