import { FC } from "react";

import { ProjectReportFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Banner, { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import ReportHeader from "@/redesignComponents/content/headers/PageHeaders/ReportHeader/ReportHeader";
import { EntityName, SingularReportsModelNames } from "@/types/common";

export interface ReportBannerProps extends Omit<BannerProps, "children"> {
  report: ProjectReportFullDto | SiteReportFullDto;
  title: string;
  dueAt?: string | null;
  entityName: SingularReportsModelNames;
}

const ReportBanner: FC<ReportBannerProps> = ({ report, title, dueAt, entityName, ...bannerProps }) => (
  <Banner {...bannerProps}>
    <ReportHeader report={report} title={title} dueAt={dueAt} entityName={entityName as EntityName} />
  </Banner>
);

export default ReportBanner;
