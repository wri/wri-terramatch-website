import { FC } from "react";

import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { ProjectFullDto, ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  DemographicsLoader,
  getReportKeyIndicatorFramework,
  getTooltipContent
} from "@/pages/reports/components/KeyIndicators/reportKeyIndicatorPrimitives";
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

type ProjectReportKeyIndicatorsContent = ReturnType<typeof useProjectReportKeyIndicatorsContent>;

type TerrafundKeyIndicatorsProps = FrameworkKeyIndicatorsProps & {
  content: ProjectReportKeyIndicatorsContent["terrafund"];
};

type PpcKeyIndicatorsProps = FrameworkKeyIndicatorsProps & {
  content: ProjectReportKeyIndicatorsContent["ppc"];
};

type HbfKeyIndicatorsProps = FrameworkKeyIndicatorsProps & {
  content: ProjectReportKeyIndicatorsContent["hbf"];
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

const TerrafundKeyIndicators: FC<TerrafundKeyIndicatorsProps> = ({ projectReport, project, content }) => {
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
        title={content.treesPlanted.title}
        progress={metrics.treesPlantedTotal}
        goal={metrics.treesGrownGoal}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesPlanted"
        className="flex-1"
        tooltipContent={getTooltipContent(content.treesPlanted)}
      />
      <MetricCard
        title={content.treesRegenerated.title}
        progress={metrics.treesRegenerated}
        goal={metrics.treesRegeneratedGoal}
        variant="large"
        icon={<RegenerationIcon />}
        color="secondary.600"
        type="treesRegenerated"
        className="flex-1"
        tooltipContent={getTooltipContent(content.treesRegenerated)}
      />
      <MetricCard
        title={content.jobsCreated.title}
        progress={jobsCreated}
        goal={metrics.jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="jobsCreated"
        className="flex-1"
        tooltipContent={getTooltipContent(content.jobsCreated)}
      />
    </>
  );
};

const PpcKeyIndicators: FC<PpcKeyIndicatorsProps> = ({ projectReport, project, content }) => {
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
        title={content.treesGrowing.title}
        progress={metrics.treesPlantedTotal}
        goal={metrics.treesGrownGoal}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesGrowing"
        className="flex-1"
        tooltipContent={getTooltipContent(content.treesGrowing)}
      />
      <MetricCard
        title={content.workdaysCreated.title}
        progress={workdaysCreated}
        goal={metrics.jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className="flex-1"
        tooltipContent={getTooltipContent(content.workdaysCreated)}
        frameworkKey={projectReport.frameworkKey ?? undefined}
      />
    </>
  );
};

const HbfKeyIndicators: FC<HbfKeyIndicatorsProps> = ({ projectReport, project, content }) => {
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
        title={content.saplingsGrowing.title}
        progress={metrics.treesPlantedTotal}
        goal={metrics.treesGrownGoal}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        type="saplingsGrowing"
        className="flex-1"
        tooltipContent={getTooltipContent(content.saplingsGrowing)}
      />
      <MetricCard
        title={content.workdaysCreated.title}
        progress={directWorkdaysCreated}
        goal={metrics.jobsCreatedGoal}
        variant="large"
        icon={<JobsIcon />}
        color="secondary.600"
        type="workdaysCreated"
        className="flex-1"
        tooltipContent={getTooltipContent(content.workdaysCreated)}
        frameworkKey={projectReport.frameworkKey ?? undefined}
      />
    </>
  );
};

const KeyIndicatorsInsights: FC<KeyIndicatorsInsightsProps> = ({ projectReport, project }) => {
  const content = useProjectReportKeyIndicatorsContent();
  const framework = getReportKeyIndicatorFramework(projectReport.frameworkKey);

  return (
    <MetricCardsRow>
      {framework === "ppc" ? (
        <PpcKeyIndicators projectReport={projectReport} project={project} content={content.ppc} />
      ) : framework === "hbf" ? (
        <HbfKeyIndicators projectReport={projectReport} project={project} content={content.hbf} />
      ) : (
        <TerrafundKeyIndicators projectReport={projectReport} project={project} content={content.terrafund} />
      )}
    </MetricCardsRow>
  );
};

export default KeyIndicatorsInsights;
