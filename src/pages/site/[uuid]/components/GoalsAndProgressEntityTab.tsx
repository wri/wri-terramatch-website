import { useT } from "@transifex/react";
import React, { FC } from "react";

import ProgressGoalsDoughnutChart, {
  ProgressGoalsData
} from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { GoalProgressCardItemProps } from "@/components/elements/Cards/GoalProgressCard/GoalProgressCardItem";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { SUMMARY_ANR_ROLLUP_HIDE, SUMMARY_REPLANTING_ROLLUP_HIDE } from "@/constants/summaryRollupVisibility";
import { Framework, isTerrafund, toFramework } from "@/context/framework.provider";
import { ProjectFullDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { TranslatedText } from "@/i18n/types";

import useTooltipsGoalsAndProgress from "./useTooltipsGoalsAndProgress";

interface GoalsAndProgressEntityTabProps {
  entity: ProjectFullDto | SiteFullDto;
  project?: boolean;
}
interface ProgressDataCardItem {
  cardValues: {
    label: TranslatedText;
    value: number;
    totalName?: TranslatedText;
    totalValue?: number;
  };
  chartData: ProgressGoalsData;
  graph?: boolean;
  hectares?: boolean;
  tooltipContent?: TranslatedText;
}

type ChartsData = {
  terrafund: JSX.Element[];
  ppc: JSX.Element[];
  hbf: JSX.Element[];
};

const ProgressDataCard: FC<ProgressDataCardItem> = values => {
  return (
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
      tootipContent={values.tooltipContent}
      tooltipTitle={values.tooltipContent != null ? values.cardValues.label : undefined}
      chart={<ProgressGoalsDoughnutChart key={"items"} data={values.chartData} />}
    />
  );
};

const GoalsAndProgressEntityTab: FC<GoalsAndProgressEntityTabProps> = ({ entity, project = false }) => {
  const t = useT();
  const tooltips = useTooltipsGoalsAndProgress();
  const framework = toFramework(entity.frameworkKey);
  const hideAnrRollup = SUMMARY_ANR_ROLLUP_HIDE.includes(framework);
  const hideReplantingRollup = SUMMARY_REPLANTING_ROLLUP_HIDE.includes(framework);
  const treesFromReportsAnr = hideAnrRollup ? 0 : entity.regeneratedTreesCount ?? 0;
  const totalTreesRestoredCount =
    (entity.treesPlantedCount ?? 0) + (entity.seedsPlantedCount ?? 0) + treesFromReportsAnr;
  const projectEntity = "totalJobsCreated" in entity ? entity : undefined;
  const metrics = {
    totalJobsCreated: project ? projectEntity?.totalJobsCreated ?? 0 : 0,
    jobsCreatedGoal: project ? projectEntity?.jobsCreatedGoal ?? 0 : 0,
    totalHectaresRestoredSum:
      project && framework === Framework.PPC
        ? Math.round(entity.totalHectaresRestoredSum)
        : entity.totalHectaresRestoredSum,
    totalHectaresRestoredGoal:
      (project
        ? projectEntity?.totalHectaresRestoredGoal
        : "hectaresToRestoreGoal" in entity
        ? entity.hectaresToRestoreGoal
        : undefined) ?? 0,
    treesRestoredCount: totalTreesRestoredCount,
    treesGrownGoal: project ? projectEntity?.treesGrownGoal ?? 0 : 0,
    workdayCount: framework === Framework.PPC ? entity.combinedWorkdayCount : entity.workdayCount
  };
  const chartDataJobs = {
    chartData: [
      { name: t("JOBS CREATED"), value: metrics.totalJobsCreated },
      {
        name: t("TOTAL JOBS CREATED GOAL"),
        value: metrics.jobsCreatedGoal
      }
    ],
    cardValues: {
      label: t("Jobs Created"),
      value: metrics.totalJobsCreated,
      totalName: t("TOTAL JOBS CREATED GOAL"),
      totalValue: metrics.jobsCreatedGoal
    },
    graph: true,
    hectares: false
  };
  const chartDataHectares = {
    chartData: [
      {
        name: t("HECTARES RESTORED"),
        value: metrics.totalHectaresRestoredSum
      },
      {
        name: t("TOTAL HECTARES RESTORED"),
        value: metrics.totalHectaresRestoredGoal
      }
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: metrics.totalHectaresRestoredSum,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: metrics.totalHectaresRestoredGoal
    }
  };
  const chartDataTreesRestored = {
    chartData: [
      { name: t("TREES RESTORED"), value: metrics.treesRestoredCount },
      {
        name: t("TOTAL TREES RESTORED"),
        value: metrics.treesGrownGoal
      }
    ],
    cardValues: {
      label: t("TREES RESTORED"),
      value: metrics.treesRestoredCount,
      totalName: t("TOTAL TREES RESTORED"),
      totalValue: metrics.treesGrownGoal
    }
  };
  const chartDataWorkdays = {
    chartData: [
      {
        name: t("WORKDAYS CREATED"),
        value: metrics.workdayCount
      }
    ],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: metrics.workdayCount
    }
  };
  const chartDataSaplings = {
    chartData: [
      { name: t("SAPLINGS RESTORED"), value: metrics.treesRestoredCount },
      {
        name: t("TOTAL SAPLINGS RESTORED"),
        value: metrics.treesGrownGoal
      }
    ],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: metrics.treesRestoredCount,
      totalName: t("TOTAL SAPLINGS RESTORED"),
      totalValue: metrics.treesGrownGoal
    }
  };

  const chartsDataMapping: ChartsData = {
    terrafund: [
      ...(project
        ? [
            <ProgressDataCard
              key={"terrafund-0"}
              cardValues={chartDataJobs.cardValues}
              chartData={chartDataJobs}
              graph={chartDataJobs.graph}
              hectares={chartDataJobs.hectares}
            />
          ]
        : []),
      <ProgressDataCard
        key={"terrafund-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
        graph={true}
        tooltipContent={project ? tooltips.TOOLTIP_HECTARES_RESTORED_PROJECT : tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key={"terrafund-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={project}
        tooltipContent={project ? tooltips.TOOLTIP_TREE_RESTORED_PROJECT : tooltips.TOOLTIP_TREE_RESTORED_SITE}
      />
    ],
    ppc: [
      <ProgressDataCard
        key={"ppc-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        graph={project}
        hectares={true}
        tooltipContent={project ? tooltips.TOOLTIP_HECTARES_RESTORED_PROJECT : tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key={"ppc-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={project}
        tooltipContent={project ? tooltips.TOOLTIP_TREE_RESTORED_PROJECT : tooltips.TOOLTIP_TREE_RESTORED_SITE}
      />,
      <ProgressDataCard
        key={"ppc-3"}
        cardValues={chartDataWorkdays.cardValues}
        chartData={chartDataWorkdays}
        graph={false}
      />
    ],
    hbf: [
      <ProgressDataCard
        key={"hbf-1"}
        cardValues={chartDataWorkdays.cardValues}
        chartData={chartDataWorkdays}
        graph={false}
      />,
      <ProgressDataCard
        key={"hbf-2"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
        tooltipContent={project ? tooltips.TOOLTIP_HECTARES_RESTORED_PROJECT : tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key={"hbf-3"}
        cardValues={chartDataSaplings.cardValues}
        chartData={chartDataSaplings}
        graph={project}
        tooltipContent={project ? tooltips.TOOLTIP_SAPLING_RESTORED_PROJECT : tooltips.TOOLTIP_SAPLING_RESTORED_SITE}
      />
    ]
  };
  const chartFramework = isTerrafund(framework) ? Framework.TF : framework;
  const totalCountReplanting = usePlantTotalCount({
    entity: project ? "projects" : "sites",
    entityUuid: entity.uuid,
    collection: "replanting"
  });

  const treesRestoredItems: GoalProgressCardItemProps[] = [
    {
      iconName: IconNames.TREE_CIRCLE_PD,
      label: t("Trees Planted:"),
      variantLabel: "text-14",
      classNameLabel: " text-neutral-650 uppercase",
      value: entity.treesPlantedCount ?? 0,
      tooltipContent: project ? tooltips.TOOLTIP_TREES_PLANTED_PROJECT : tooltips.TOOLTIP_TREES_PLANTED_SITE,
      classNameLabelValue: "flex items-center gap-2"
    },
    {
      iconName: IconNames.LEAF_CIRCLE_PD,
      label: t("Seeds Planted:"),
      variantLabel: "text-14",
      classNameLabel: " text-neutral-650 uppercase",
      value: entity.seedsPlantedCount,
      tooltipContent: project ? tooltips.TOOLTIP_SEEDS_PLANTED_PROJECT : tooltips.TOOLTIP_SEEDS_PLANTED_SITE
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
            tooltipContent: project
              ? tooltips.TOOLTIP_TREES_REGENERATING_PROJECT
              : tooltips.TOOLTIP_TREES_REGENERATING_SITE
          }
        ] satisfies GoalProgressCardItemProps[])),
    ...(hideReplantingRollup
      ? []
      : ([
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Replanted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: totalCountReplanting,
            tooltipContent: project ? tooltips.TOOLTIP_TREES_REPLANTING_PROJECT : tooltips.TOOLTIP_TREES_REPLANTING_SITE
          }
        ] satisfies GoalProgressCardItemProps[]))
  ];

  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-4">
      {(chartFramework === Framework.TF || chartFramework === Framework.PPC || chartFramework === Framework.HBF) &&
        chartsDataMapping[chartFramework]}
      <GoalProgressCard
        label={t("Trees restored")}
        value={totalTreesRestoredCount}
        limit={projectEntity?.treesGrownGoal ?? undefined}
        hasProgress={false}
        items={treesRestoredItems}
        className="pr-[41px] lg:pr-[150px] mobile:w-[400px] mobile:!pr-0"
      />
    </div>
  );
};
export default GoalsAndProgressEntityTab;
