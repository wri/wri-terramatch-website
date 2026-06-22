import { FC } from "react";

import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import {
  DemographicsLoader,
  getReportKeyIndicatorFramework,
  getTooltipContent,
  REPORT_METRIC_CARD_CLASS
} from "@/components/reports/KeyIndicators/reportKeyIndicatorPrimitives";
import { SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useSiteReportKeyIndicatorsContent } from "@/pages/reports/site-report/constants/siteReportKeyIndicatorsContent";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import {
  DirectSeedingIcon,
  JobsIcon,
  RegenerationIcon,
  SurvivalRateIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";

interface SiteReportKeyIndicatorsInsightsProps {
  siteReport: SiteReportFullDto;
  workdaysTotal?: number | null;
}

type FrameworkKeyIndicatorsProps = {
  siteReport: SiteReportFullDto;
  workdaysTotal?: number | null;
};

type SiteReportKeyIndicatorsContent = ReturnType<typeof useSiteReportKeyIndicatorsContent>;

type TerrafundSiteReportKeyIndicatorsProps = FrameworkKeyIndicatorsProps & {
  content: SiteReportKeyIndicatorsContent["terrafund"];
};

type PpcSiteReportKeyIndicatorsProps = FrameworkKeyIndicatorsProps & {
  content: SiteReportKeyIndicatorsContent["ppc"];
};

type HbfSiteReportKeyIndicatorsProps = FrameworkKeyIndicatorsProps & {
  content: SiteReportKeyIndicatorsContent["hbf"];
};

const getTreesRegeneratingCount = (siteReport: SiteReportFullDto): number => {
  const speciesTotal = siteReport.totalTreesRegeneratingSpeciesCount ?? 0;
  const estimate = siteReport.numTreesRegenerating ?? 0;

  return speciesTotal > 0 ? speciesTotal : estimate;
};

const SiteReportDemographicsLoader = () => (
  <DemographicsLoader className="h-32 min-w-[calc((100%_-_0.75rem)_/_2)] flex-1 lg:min-w-[calc((100%_-_1.5rem)_/_2)]" />
);

const TerrafundSiteReportKeyIndicators: FC<TerrafundSiteReportKeyIndicatorsProps> = ({ siteReport, content }) => {
  const treesRegenerating = getTreesRegeneratingCount(siteReport);

  return (
    <>
      <MetricCard
        title={content.treesPlanted.title}
        progress={siteReport.totalTreesPlantedCount ?? 0}
        goal={0}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        className={REPORT_METRIC_CARD_CLASS}
        metricLabel="trees_planted"
        tooltipContent={getTooltipContent(content.treesPlanted)}
      />
      <MetricCard
        title={content.survivalRate.title}
        progress={siteReport.pctSurvivalToDate ?? 0}
        progressLabel={`${siteReport.pctSurvivalToDate ?? 0}%`}
        goal={0}
        variant="large"
        icon={<SurvivalRateIcon />}
        color="secondary.600"
        className={REPORT_METRIC_CARD_CLASS}
        metricLabel="survival_rate"
        tooltipContent={getTooltipContent(content.survivalRate)}
      />
      <MetricCard
        title={content.treesRegenerated.title}
        progress={treesRegenerating}
        goal={0}
        variant="large"
        icon={<RegenerationIcon />}
        color="secondary.600"
        className={REPORT_METRIC_CARD_CLASS}
        metricLabel="trees_regenerated"
        tooltipContent={getTooltipContent(content.treesRegenerated)}
      />
    </>
  );
};

const PpcSiteReportKeyIndicators: FC<PpcSiteReportKeyIndicatorsProps> = ({ siteReport, workdaysTotal, content }) => {
  const treesRegenerating = getTreesRegeneratingCount(siteReport);

  return (
    <>
      <MetricCard
        title={content.treesPlanted.title}
        progress={siteReport.totalTreesPlantedCount ?? 0}
        goal={0}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        className={REPORT_METRIC_CARD_CLASS}
        metricLabel="trees_planted"
        tooltipContent={getTooltipContent(content.treesPlanted)}
      />
      <MetricCard
        title={content.directSeeding.title}
        progress={siteReport.totalSeedsPlantedCount ?? 0}
        goal={0}
        variant="large"
        icon={<DirectSeedingIcon />}
        color="secondary.600"
        className={REPORT_METRIC_CARD_CLASS}
        metricLabel="direct_seeding"
        tooltipContent={getTooltipContent(content.directSeeding)}
      />
      <MetricCard
        title={content.treesRegenerating.title}
        progress={treesRegenerating}
        goal={0}
        variant="large"
        icon={<RegenerationIcon />}
        color="secondary.600"
        className={REPORT_METRIC_CARD_CLASS}
        metricLabel="trees_regenerating"
        tooltipContent={getTooltipContent(content.treesRegenerating)}
      />
      {workdaysTotal == null ? (
        <SiteReportDemographicsLoader />
      ) : (
        <MetricCard
          title={content.workdays.title}
          progress={workdaysTotal}
          goal={0}
          variant="large"
          icon={<JobsIcon />}
          color="secondary.600"
          className={REPORT_METRIC_CARD_CLASS}
          metricLabel="workdays"
          tooltipContent={getTooltipContent(content.workdays)}
        />
      )}
    </>
  );
};

const HbfSiteReportKeyIndicators: FC<HbfSiteReportKeyIndicatorsProps> = ({ siteReport, content }) => {
  return (
    <MetricCard
      title={content.treesPlanted.title}
      progress={siteReport.totalTreesPlantedCount ?? 0}
      goal={0}
      variant="large"
      icon={<TreeIcon />}
      color="secondary.600"
      className="flex-[1]"
      metricLabel="trees_planted"
      tooltipContent={getTooltipContent(content.treesPlanted)}
    />
  );
};

const SiteReportKeyIndicatorsInsights: FC<SiteReportKeyIndicatorsInsightsProps> = ({ siteReport, workdaysTotal }) => {
  const content = useSiteReportKeyIndicatorsContent();
  const framework = getReportKeyIndicatorFramework(siteReport.frameworkKey);

  return (
    <MetricCardsRow>
      {framework === "ppc" ? (
        <PpcSiteReportKeyIndicators siteReport={siteReport} workdaysTotal={workdaysTotal} content={content.ppc} />
      ) : framework === "hbf" ? (
        <HbfSiteReportKeyIndicators siteReport={siteReport} content={content.hbf} />
      ) : (
        <TerrafundSiteReportKeyIndicators siteReport={siteReport} content={content.terrafund} />
      )}
    </MetricCardsRow>
  );
};

export default SiteReportKeyIndicatorsInsights;
