import { useT } from "@transifex/react";
import React from "react";

import ProgressGoalsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { GoalProgressCardItemProps } from "@/components/elements/Cards/GoalProgressCard/GoalProgressCardItem";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { SUMMARY_ANR_ROLLUP_HIDE, SUMMARY_REPLANTING_ROLLUP_HIDE } from "@/constants/summaryRollupVisibility";
import { Framework, isTerrafund, toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { TranslatedText } from "@/i18n/types";
import useTooltipsGoalsAndProgress from "@/pages/site/[uuid]/components/useTooltipsGoalsAndProgress";

import {
  GoalsAndProgressReportGoals,
  GoalsAndProgressReportMetrics,
  ReportEntityName
} from "./GoalsAndProgressReportSections";

export type GoalsAndProgressReportEntityTabProps = {
  entity: ReportEntityName;
  entityUuid: string;
  frameworkKey: string | null;
  metrics: GoalsAndProgressReportMetrics;
  goals?: GoalsAndProgressReportGoals;
  siteGoals?: SiteFullDto | null;
  workdaysTotal?: number | null;
};

interface ProgressDataCardItem {
  cardValues: {
    label: TranslatedText;
    value: number;
    totalName?: TranslatedText;
    totalValue?: number;
  };
  chartData: any;
  graph?: boolean;
  hectares?: boolean;
  tooltipContent?: TranslatedText;
}

const ProgressDataCard = (values: ProgressDataCardItem) => (
  <GoalProgressCard
    label={values.cardValues.label}
    value={values.cardValues.value}
    totalValue={values.cardValues.totalValue}
    hectares={values.hectares}
    graph={values.graph}
    classNameLabel="text-neutral-650 uppercase mb-3 flex items-center gap-2 justify-center"
    labelVariant="text-14"
    classNameCard="text-center flex flex-col items-center"
    classNameLabelValue="justify-center"
    tootipContent={values.tooltipContent ? values.tooltipContent : undefined}
    tooltipTitle={values.tooltipContent ? values.cardValues.label : undefined}
    chart={<ProgressGoalsDoughnutChart key="items" data={values.chartData} />}
  />
);

const NurseryReportEntityTab = ({ metrics }: Pick<GoalsAndProgressReportEntityTabProps, "metrics">) => {
  const t = useT();
  const seedlingsGrown = metrics.seedlingsGrown ?? 0;

  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-4">
      <ProgressDataCard
        cardValues={{
          label: t("Seedlings Grown"),
          value: seedlingsGrown
        }}
        chartData={{
          chartData: [{ name: t("SEEDLINGS GROWN"), value: seedlingsGrown }],
          cardValues: { label: t("Seedlings Grown"), value: seedlingsGrown }
        }}
        graph={false}
      />
    </div>
  );
};

const ProjectSiteReportEntityTab = ({
  entity,
  entityUuid,
  frameworkKey,
  metrics,
  goals,
  siteGoals,
  workdaysTotal
}: Omit<GoalsAndProgressReportEntityTabProps, "entity"> & { entity: "projectReports" | "siteReports" }) => {
  const t = useT();
  const tooltips = useTooltipsGoalsAndProgress();
  const framework = toFramework(frameworkKey);
  const isSiteReport = entity === "siteReports";
  const hideAnrRollup = SUMMARY_ANR_ROLLUP_HIDE.includes(framework);
  const hideReplantingRollup = SUMMARY_REPLANTING_ROLLUP_HIDE.includes(framework);
  const treesFromReportsAnr = hideAnrRollup ? 0 : metrics.regeneratedTreesCount;
  const totalTreesRestoredCount = metrics.treesPlantedCount + metrics.seedsPlantedCount + treesFromReportsAnr;

  const reportJobsCreated = useCollectionsTotal({
    entity: "projectReports",
    uuid: entityUuid,
    domain: "demographics",
    trackingType: "jobs" as TrackingType,
    collections: DemographicCollections.JOBS_PROJECT
  });
  const projectWorkdaysCreated = useCollectionsTotal({
    entity: "projectReports",
    uuid: entityUuid,
    domain: "demographics",
    trackingType: "workdays" as TrackingType,
    collections: framework === Framework.HBF ? (["direct"] as const) : DemographicCollections.WORKDAYS_PROJECT
  });
  const siteWorkdaysFromTrackings = useCollectionsTotal({
    entity: "siteReports",
    uuid: entityUuid,
    domain: "demographics",
    trackingType: "workdays" as TrackingType,
    collections: DemographicCollections.WORKDAYS_SITE
  });

  const workdayCount =
    entity === "projectReports" ? projectWorkdaysCreated ?? 0 : workdaysTotal ?? siteWorkdaysFromTrackings ?? 0;

  const attrib = {
    totalJobsCreated: entity === "projectReports" ? reportJobsCreated ?? 0 : 0,
    jobsCreatedGoal: goals?.jobsCreatedGoal,
    totalHectaresRestoredSum: siteGoals?.totalHectaresRestoredSum,
    totalHectaresRestoredGoal: siteGoals?.hectaresToRestoreGoal,
    treesRestoredCount: totalTreesRestoredCount,
    treesGrownGoal: goals?.treesGrownGoal,
    workdayCount
  };

  const chartDataJobs = {
    chartData: [
      { name: t("JOBS CREATED"), value: attrib.totalJobsCreated },
      { name: t("TOTAL JOBS CREATED GOAL"), value: attrib.jobsCreatedGoal }
    ],
    cardValues: {
      label: t("Jobs Created"),
      value: attrib.totalJobsCreated,
      totalName: t("TOTAL JOBS CREATED GOAL"),
      totalValue: goals?.jobsCreatedGoal ?? undefined
    },
    graph: true,
    hectares: false
  };
  const chartDataHectares = {
    chartData: [
      { name: t("HECTARES RESTORED"), value: attrib.totalHectaresRestoredSum },
      { name: t("TOTAL HECTARES RESTORED"), value: parseFloat(String(attrib.totalHectaresRestoredGoal ?? 0)) }
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: attrib.totalHectaresRestoredSum ?? 0,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: parseFloat(String(attrib.totalHectaresRestoredGoal ?? 0))
    }
  };
  const chartDataTreesRestored = {
    chartData: [
      { name: t("TREES RESTORED"), value: attrib.treesRestoredCount },
      { name: t("TOTAL TREES RESTORED"), value: parseFloat(String(attrib.treesGrownGoal ?? 0)) }
    ],
    cardValues: {
      label: t("TREES RESTORED"),
      value: attrib.treesRestoredCount,
      totalName: t("TOTAL TREES RESTORED"),
      totalValue: parseFloat(String(attrib.treesGrownGoal ?? 0))
    }
  };
  const chartDataWorkdays = {
    chartData: [{ name: t("WORKDAYS CREATED"), value: attrib.workdayCount }],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: attrib.workdayCount
    }
  };
  const chartDataSaplings = {
    chartData: [
      { name: t("SAPLINGS RESTORED"), value: attrib.treesRestoredCount },
      { name: t("TOTAL SAPLINGS RESTORED"), value: parseFloat(String(attrib.treesGrownGoal ?? 0)) }
    ],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: attrib.treesRestoredCount,
      totalName: t("TOTAL SAPLINGS RESTORED"),
      totalValue: parseFloat(String(attrib.treesGrownGoal ?? 0))
    }
  };

  const chartFramework = isTerrafund(frameworkKey as Framework) ? Framework.TF : (frameworkKey as Framework);
  const showGoalComparison = entity === "projectReports";
  const siteTreesTooltip = isSiteReport ? tooltips.TOOLTIP_TREE_RESTORED_SITE : tooltips.TOOLTIP_TREE_RESTORED_PROJECT;
  const siteSaplingsTooltip = isSiteReport
    ? tooltips.TOOLTIP_SAPLING_RESTORED_SITE
    : tooltips.TOOLTIP_SAPLING_RESTORED_PROJECT;

  const chartsDataMapping = {
    terrafund: [
      ...(entity === "projectReports"
        ? [
            <ProgressDataCard
              key="terrafund-0"
              cardValues={chartDataJobs.cardValues}
              chartData={chartDataJobs}
              graph={chartDataJobs.graph}
              hectares={chartDataJobs.hectares}
            />
          ]
        : []),
      ...(isSiteReport && siteGoals != null
        ? [
            <ProgressDataCard
              key="terrafund-1"
              cardValues={chartDataHectares.cardValues}
              chartData={chartDataHectares}
              hectares
              graph
              tooltipContent={tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
            />
          ]
        : []),
      <ProgressDataCard
        key="terrafund-2"
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={showGoalComparison}
        tooltipContent={siteTreesTooltip}
      />
    ],
    ppc: [
      ...(isSiteReport && siteGoals != null
        ? [
            <ProgressDataCard
              key="ppc-1"
              cardValues={chartDataHectares.cardValues}
              chartData={chartDataHectares}
              graph={false}
              hectares
              tooltipContent={tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
            />
          ]
        : []),
      <ProgressDataCard
        key="ppc-2"
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={showGoalComparison}
        tooltipContent={siteTreesTooltip}
      />,
      <ProgressDataCard
        key="ppc-3"
        cardValues={chartDataWorkdays.cardValues}
        chartData={chartDataWorkdays}
        graph={false}
      />
    ],
    hbf: [
      <ProgressDataCard
        key="hbf-1"
        cardValues={chartDataWorkdays.cardValues}
        chartData={chartDataWorkdays}
        graph={false}
      />,
      ...(isSiteReport && siteGoals != null
        ? [
            <ProgressDataCard
              key="hbf-2"
              cardValues={chartDataHectares.cardValues}
              chartData={chartDataHectares}
              hectares
              tooltipContent={tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
            />
          ]
        : []),
      <ProgressDataCard
        key="hbf-3"
        cardValues={chartDataSaplings.cardValues}
        chartData={chartDataSaplings}
        graph={showGoalComparison}
        tooltipContent={siteSaplingsTooltip}
      />
    ]
  };

  const totalCountReplanting = usePlantTotalCount({
    entity,
    entityUuid,
    collection: "replanting"
  });

  const plantedTooltip = isSiteReport ? tooltips.TOOLTIP_TREES_PLANTED_SITE : tooltips.TOOLTIP_TREES_PLANTED_PROJECT;
  const seedsTooltip = isSiteReport ? tooltips.TOOLTIP_SEEDS_PLANTED_SITE : tooltips.TOOLTIP_SEEDS_PLANTED_PROJECT;
  const regeneratingTooltip = isSiteReport
    ? tooltips.TOOLTIP_TREES_REGENERATING_SITE
    : tooltips.TOOLTIP_TREES_REGENERATING_PROJECT;
  const replantingTooltip = isSiteReport
    ? tooltips.TOOLTIP_TREES_REPLANTING_SITE
    : tooltips.TOOLTIP_TREES_REPLANTING_PROJECT;

  const treesRestoredItems: GoalProgressCardItemProps[] = [
    {
      iconName: IconNames.TREE_CIRCLE_PD,
      label: t("Trees Planted:"),
      variantLabel: "text-14",
      classNameLabel: " text-neutral-650 uppercase",
      value: metrics.treesPlantedCount,
      tooltipContent: plantedTooltip,
      classNameLabelValue: "flex items-center gap-2"
    },
    {
      iconName: IconNames.LEAF_CIRCLE_PD,
      label: t("Seeds Planted:"),
      variantLabel: "text-14",
      classNameLabel: " text-neutral-650 uppercase",
      value: metrics.seedsPlantedCount,
      tooltipContent: seedsTooltip
    },
    ...(hideAnrRollup
      ? []
      : ([
          {
            iconName: IconNames.REFRESH_CIRCLE_PD,
            label: t("Trees Regenerating:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: treesFromReportsAnr,
            tooltipContent: regeneratingTooltip
          }
        ] as GoalProgressCardItemProps[])),
    ...(hideReplantingRollup
      ? []
      : ([
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Replanted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: totalCountReplanting > 0 ? totalCountReplanting : metrics.treeReplantingCount ?? 0,
            tooltipContent: replantingTooltip
          }
        ] as GoalProgressCardItemProps[]))
  ];

  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-4">
      {chartsDataMapping[chartFramework as keyof typeof chartsDataMapping]?.map((chart, index) => (
        <React.Fragment key={index}>{chart}</React.Fragment>
      ))}
      <GoalProgressCard
        label={t("Trees restored")}
        value={totalTreesRestoredCount}
        limit={goals?.treesGrownGoal ?? undefined}
        hasProgress={false}
        items={treesRestoredItems}
        className="pr-[41px] lg:pr-[150px] mobile:w-[400px] mobile:!pr-0"
      />
    </div>
  );
};

const GoalsAndProgressReportEntityTab = (props: GoalsAndProgressReportEntityTabProps) => {
  if (props.entity === "nurseryReports") {
    return <NurseryReportEntityTab metrics={props.metrics} />;
  }

  return <ProjectSiteReportEntityTab {...props} entity={props.entity} />;
};

export default GoalsAndProgressReportEntityTab;
