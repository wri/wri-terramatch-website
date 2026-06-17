import { Box } from "@chakra-ui/react";
import { FC } from "react";

import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import Loader from "@/components/generic/Loading/Loader";
import { Framework, toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { ProjectFullDto, ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useProjectReportKeyIndicatorsContent } from "@/pages/reports/project-report/constants/projectReportKeyIndicatorsContent";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { JobsIcon, RegenerationIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

interface KeyIndicatorsInsightsProps {
  projectReport: ProjectReportFullDto;
  project?: ProjectFullDto | null;
}

type FrameworkKeyIndicatorsProps = {
  projectReport: ProjectReportFullDto;
  project?: ProjectFullDto | null;
};

type KeyIndicatorsMetrics = {
  treesPlantedTotal: number;
  treesRegenerated: number;
  treesGrownGoal: number;
  treesRegeneratedGoal: number;
  jobsCreatedGoal: number;
};

const getKeyIndicatorsMetrics = (
  projectReport: ProjectReportFullDto,
  project?: ProjectFullDto | null
): KeyIndicatorsMetrics => ({
  treesPlantedTotal:
    (projectReport.treesPlantedCount ?? 0) +
    (projectReport.seedsPlantedCount ?? 0) +
    (projectReport.regeneratedTreesCount ?? 0),
  treesRegenerated: projectReport.regeneratedTreesCount ?? 0,
  treesGrownGoal: project?.treesGrownGoal ?? 0,
  treesRegeneratedGoal: project?.goalTreesRestoredAnr ?? 0,
  jobsCreatedGoal: project?.jobsCreatedGoal ?? 0
});

const MetricTooltip = ({ title, tooltip }: { title: string; tooltip: string }) => (
  <Box fontSize="14px" lineHeight="20px">
    <b>{title}</b>
    <br />
    {tooltip}
  </Box>
);

const DemographicsLoader = () => <Loader className="h-32 w-full flex-1" />;

const TerrafundKeyIndicators: FC<FrameworkKeyIndicatorsProps> = ({ projectReport, project }) => {
  const content = useProjectReportKeyIndicatorsContent();
  const metrics = getKeyIndicatorsMetrics(projectReport, project);

  const jobsCreated = useCollectionsTotal({
    entity: "projectReports",
    uuid: projectReport.uuid,
    domain: "demographics",
    trackingType: "jobs" as TrackingType,
    collections: DemographicCollections.JOBS_PROJECT
  });

  if (jobsCreated == null) return <DemographicsLoader />;

  return (
    <>
      <MetricCard
        title={content.terrafund.treesPlanted.title}
        progress={metrics.treesPlantedTotal}
        goal={metrics.treesGrownGoal}
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
        progress={metrics.treesRegenerated}
        goal={metrics.treesRegeneratedGoal}
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
        goal={metrics.jobsCreatedGoal}
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
};

const PpcKeyIndicators: FC<FrameworkKeyIndicatorsProps> = ({ projectReport, project }) => {
  const content = useProjectReportKeyIndicatorsContent();
  const metrics = getKeyIndicatorsMetrics(projectReport, project);

  const workdaysCreated = useCollectionsTotal({
    entity: "projectReports",
    uuid: projectReport.uuid,
    domain: "demographics",
    trackingType: "workdays" as TrackingType,
    collections: DemographicCollections.WORKDAYS_PROJECT
  });

  if (workdaysCreated == null) return <DemographicsLoader />;

  return (
    <>
      <MetricCard
        title={content.ppc.treesGrowing.title}
        progress={metrics.treesPlantedTotal}
        goal={metrics.treesGrownGoal}
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
        goal={metrics.jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className="flex-1"
        tooltipContent={
          <MetricTooltip title={content.ppc.workdaysCreated.title} tooltip={content.ppc.workdaysCreated.tooltip} />
        }
        frameworkKey={projectReport.frameworkKey ?? undefined}
      />
    </>
  );
};

const HbfKeyIndicators: FC<FrameworkKeyIndicatorsProps> = ({ projectReport, project }) => {
  const content = useProjectReportKeyIndicatorsContent();
  const metrics = getKeyIndicatorsMetrics(projectReport, project);

  const directWorkdaysCreated = useCollectionsTotal({
    entity: "projectReports",
    uuid: projectReport.uuid,
    domain: "demographics",
    trackingType: "workdays" as TrackingType,
    collections: ["direct"]
  });

  if (directWorkdaysCreated == null) return <DemographicsLoader />;

  return (
    <>
      <MetricCard
        title={content.hbf.saplingsGrowing.title}
        progress={metrics.treesPlantedTotal}
        goal={metrics.treesGrownGoal}
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
        goal={metrics.jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className="flex-1"
        tooltipContent={
          <MetricTooltip title={content.hbf.workdaysCreated.title} tooltip={content.hbf.workdaysCreated.tooltip} />
        }
        frameworkKey={projectReport.frameworkKey ?? undefined}
      />
    </>
  );
};

const KeyIndicatorsInsights: FC<KeyIndicatorsInsightsProps> = ({ projectReport, project }) => {
  const framework = toFramework(projectReport.frameworkKey);

  return (
    <MetricCardsRow>
      {framework === Framework.PPC ? (
        <PpcKeyIndicators projectReport={projectReport} project={project} />
      ) : framework === Framework.HBF ? (
        <HbfKeyIndicators projectReport={projectReport} project={project} />
      ) : (
        <TerrafundKeyIndicators projectReport={projectReport} project={project} />
      )}
    </MetricCardsRow>
  );
};

export default KeyIndicatorsInsights;
