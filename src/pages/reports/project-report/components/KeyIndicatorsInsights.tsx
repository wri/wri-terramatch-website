import { Box } from "@chakra-ui/react";
import { FC } from "react";

import MetricCardsRow, {
  METRIC_CARD_CLASS_NAME
} from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { ALL_TF, Framework, toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useProjectReportKeyIndicatorsContent } from "@/pages/reports/project-report/constants/projectReportKeyIndicatorsContent";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { JobsIcon, RegenerationIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

interface KeyIndicatorsInsightsProps {
  projectReport: ProjectReportFullDto;
}

const TERRAFUND_FRAMEWORKS = [...ALL_TF, Framework.EPA_GHANA_PILOT];

const MetricTooltip = ({ title, tooltip }: { title: string; tooltip: string }) => (
  <Box fontSize="14px" lineHeight="20px">
    <b>{title}</b>
    <br />
    {tooltip}
  </Box>
);

const KeyIndicatorsInsights: FC<KeyIndicatorsInsightsProps> = ({ projectReport }) => {
  const framework = toFramework(projectReport.frameworkKey);
  const content = useProjectReportKeyIndicatorsContent();

  const treesPlantedTotal =
    (projectReport.treesPlantedCount ?? 0) +
    (projectReport.seedsPlantedCount ?? 0) +
    (projectReport.regeneratedTreesCount ?? 0);
  const treesRegenerated = projectReport.regeneratedTreesCount ?? 0;

  const jobsCreated =
    useCollectionsTotal({
      entity: "projectReports",
      uuid: projectReport.uuid,
      domain: "demographics",
      trackingType: "jobs" as TrackingType,
      collections: DemographicCollections.JOBS_PROJECT
    }) ?? 0;

  const workdaysCreated =
    useCollectionsTotal({
      entity: "projectReports",
      uuid: projectReport.uuid,
      domain: "demographics",
      trackingType: "workdays" as TrackingType,
      collections: DemographicCollections.WORKDAYS_PROJECT
    }) ?? 0;

  const directWorkdaysCreated =
    useCollectionsTotal({
      entity: "projectReports",
      uuid: projectReport.uuid,
      domain: "demographics",
      trackingType: "workdays" as TrackingType,
      collections: ["direct"]
    }) ?? 0;

  const renderTerrafundCards = () => (
    <>
      <MetricCard
        title={content.terrafund.treesPlanted.title}
        progress={treesPlantedTotal}
        goal={0}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesPlanted"
        className={METRIC_CARD_CLASS_NAME(3)}
        tooltipContent={
          <MetricTooltip
            title={content.terrafund.treesPlanted.title}
            tooltip={content.terrafund.treesPlanted.tooltip}
          />
        }
      />
      <MetricCard
        title={content.terrafund.treesRegenerated.title}
        progress={treesRegenerated}
        goal={0}
        variant="large"
        icon={<RegenerationIcon />}
        color="secondary.600"
        type="treesRegenerated"
        className={METRIC_CARD_CLASS_NAME(3)}
        tooltipContent={
          <MetricTooltip
            title={content.terrafund.treesRegenerated.title}
            tooltip={content.terrafund.treesRegenerated.tooltip}
          />
        }
      />
      <MetricCard
        title={content.terrafund.jobsCreated.title}
        progress={jobsCreated}
        goal={0}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="jobsCreated"
        className={METRIC_CARD_CLASS_NAME(3)}
        tooltipContent={
          <MetricTooltip title={content.terrafund.jobsCreated.title} tooltip={content.terrafund.jobsCreated.tooltip} />
        }
      />
    </>
  );

  const renderPpcCards = () => (
    <>
      <MetricCard
        title={content.ppc.treesGrowing.title}
        progress={treesPlantedTotal}
        goal={0}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesGrowing"
        className={METRIC_CARD_CLASS_NAME(2)}
        tooltipContent={
          <MetricTooltip title={content.ppc.treesGrowing.title} tooltip={content.ppc.treesGrowing.tooltip} />
        }
      />
      <MetricCard
        title={content.ppc.workdaysCreated.title}
        progress={workdaysCreated}
        goal={0}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className={METRIC_CARD_CLASS_NAME(2)}
        tooltipContent={
          <MetricTooltip title={content.ppc.workdaysCreated.title} tooltip={content.ppc.workdaysCreated.tooltip} />
        }
      />
    </>
  );

  const renderHbfCards = () => (
    <>
      <MetricCard
        title={content.hbf.saplingsGrowing.title}
        progress={treesPlantedTotal}
        goal={0}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="saplingsGrowing"
        className={METRIC_CARD_CLASS_NAME(2)}
        tooltipContent={
          <MetricTooltip title={content.hbf.saplingsGrowing.title} tooltip={content.hbf.saplingsGrowing.tooltip} />
        }
      />
      <MetricCard
        title={content.hbf.workdaysCreated.title}
        progress={directWorkdaysCreated}
        goal={0}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className={METRIC_CARD_CLASS_NAME(2)}
        tooltipContent={
          <MetricTooltip title={content.hbf.workdaysCreated.title} tooltip={content.hbf.workdaysCreated.tooltip} />
        }
      />
    </>
  );

  const renderCards = () => {
    if (framework === Framework.PPC) return renderPpcCards();
    if (framework === Framework.HBF) return renderHbfCards();
    if (TERRAFUND_FRAMEWORKS.includes(framework)) return renderTerrafundCards();
    return renderTerrafundCards();
  };

  return <MetricCardsRow>{renderCards()}</MetricCardsRow>;
};

export default KeyIndicatorsInsights;
