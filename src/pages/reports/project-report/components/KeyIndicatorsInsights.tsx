import { Box } from "@chakra-ui/react";
import { FC } from "react";

import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { ALL_TF, Framework, toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { ProjectFullDto, ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useProjectReportKeyIndicatorsContent } from "@/pages/reports/project-report/constants/projectReportKeyIndicatorsContent";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { JobsIcon, RegenerationIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

interface KeyIndicatorsInsightsProps {
  projectReport: ProjectReportFullDto;
  project?: ProjectFullDto | null;
}

const TERRAFUND_FRAMEWORKS = [...ALL_TF, Framework.EPA_GHANA_PILOT];

const MetricTooltip = ({ title, tooltip }: { title: string; tooltip: string }) => (
  <Box fontSize="14px" lineHeight="20px">
    <b>{title}</b>
    <br />
    {tooltip}
  </Box>
);

const KeyIndicatorsInsights: FC<KeyIndicatorsInsightsProps> = ({ projectReport, project }) => {
  const framework = toFramework(projectReport.frameworkKey);
  const content = useProjectReportKeyIndicatorsContent();

  const treesPlantedTotal =
    (projectReport.treesPlantedCount ?? 0) +
    (projectReport.seedsPlantedCount ?? 0) +
    (projectReport.regeneratedTreesCount ?? 0);
  const treesRegenerated = projectReport.regeneratedTreesCount ?? 0;
  const treesGrownGoal = project?.treesGrownGoal ?? 0;
  const treesRegeneratedGoal = project?.goalTreesRestoredAnr ?? 0;
  const jobsCreatedGoal = project?.jobsCreatedGoal ?? 0;

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
        goal={treesGrownGoal}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesPlanted"
        className="flex-1"
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
        goal={treesRegeneratedGoal}
        variant="large"
        icon={<RegenerationIcon />}
        color="secondary.600"
        type="treesRegenerated"
        className="flex-1"
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
        goal={jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="jobsCreated"
        className="flex-1"
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
        goal={treesGrownGoal}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesGrowing"
        className="flex-1"
        tooltipContent={
          <MetricTooltip title={content.ppc.treesGrowing.title} tooltip={content.ppc.treesGrowing.tooltip} />
        }
      />
      <MetricCard
        title={content.ppc.workdaysCreated.title}
        progress={workdaysCreated}
        goal={jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className="flex-1"
        tooltipContent={
          <MetricTooltip title={content.ppc.workdaysCreated.title} tooltip={content.ppc.workdaysCreated.tooltip} />
        }
        frameworkKey={framework}
      />
    </>
  );

  const renderHbfCards = () => (
    <>
      <MetricCard
        title={content.hbf.saplingsGrowing.title}
        progress={treesPlantedTotal}
        goal={treesGrownGoal}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="saplingsGrowing"
        className="flex-1"
        tooltipContent={
          <MetricTooltip title={content.hbf.saplingsGrowing.title} tooltip={content.hbf.saplingsGrowing.tooltip} />
        }
      />
      <MetricCard
        title={content.hbf.workdaysCreated.title}
        progress={directWorkdaysCreated}
        goal={jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className="flex-1"
        tooltipContent={
          <MetricTooltip title={content.hbf.workdaysCreated.title} tooltip={content.hbf.workdaysCreated.tooltip} />
        }
        frameworkKey={framework}
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
