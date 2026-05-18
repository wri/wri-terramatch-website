import { useT } from "@transifex/react";
import React from "react";

import ProgressGoalsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { Framework, isTerrafund } from "@/context/framework.provider";

import {
  TOOLTIP_HECTARES_RESTORED_PROJECT,
  TOOLTIP_HECTARES_RESTORED_SITE,
  TOOLTIP_SAPLING_RESTORED_PROJECT,
  TOOLTIP_SAPLING_RESTORED_SITE,
  TOOLTIP_SEEDS_PLANTED_PROJECT,
  TOOLTIP_SEEDS_PLANTED_SITE,
  TOOLTIP_TREE_RESTORED_PROJECT,
  TOOLTIP_TREE_RESTORED_SITE,
  TOOLTIP_TREES_PLANTED_PROJECT,
  TOOLTIP_TREES_PLANTED_SITE,
  TOOLTIP_TREES_REGENERATING_PROJECT,
  TOOLTIP_TREES_REGENERATING_SITE,
  TOOLTIP_TREES_REPLANTING_PROJECT,
  TOOLTIP_TREES_REPLANTING_SITE
} from "./constants";

interface GoalsAndProgressEntityTabProps {
  entity: any;
  project?: boolean;
}
interface ProgressDataCardItem {
  cardValues: {
    label: string;
    value: number;
    totalName?: string;
    totalValue?: number;
  };
  chartData: any;
  graph?: boolean;
  hectares?: boolean;
  tooltipContent?: string;
}

type ChartsData = {
  terrafund: JSX.Element[];
  ppc: JSX.Element[];
  hbf: JSX.Element[];
};

const ProgressDataCard = (values: ProgressDataCardItem) => {
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
      tootipContent={values.tooltipContent ? values.tooltipContent : undefined}
      tooltipTitle={values.tooltipContent ? values.cardValues.label : undefined}
      chart={<ProgressGoalsDoughnutChart key={"items"} data={values.chartData} />}
    />
  );
};

const GoalsAndProgressEntityTab = ({ entity, project = false }: GoalsAndProgressEntityTabProps) => {
  const t = useT();
  const treesFromReportsAnr = entity?.regeneratedTreesCount ?? 0;
  const totalTreesRestoredCount =
    (entity?.treesPlantedCount ?? 0) + (entity?.seedsPlantedCount ?? 0) + treesFromReportsAnr;
  const keyAttribute = project ? "project" : "site";
  const attribMapping: { [key: string]: any } = {
    project: {
      totalJobsCreated: entity.totalJobsCreated,
      jobsCreatedGoal: entity.jobsCreatedGoal,
      totalHectaresRestoredSum:
        project && entity.frameworkKey == Framework.PPC
          ? Math.round(entity.totalHectaresRestoredSum)
          : entity.totalHectaresRestoredSum,
      totalHectaresRestoredGoal: entity.totalHectaresRestoredGoal,
      treesRestoredCount: totalTreesRestoredCount,
      treesGrownGoal: entity.treesGrownGoal,
      workdayCount: entity.frameworkKey == Framework.PPC ? entity.combinedWorkdayCount : entity.workdayCount
    },
    site: {
      totalJobsCreated: null,
      jobsCreatedGoal: null,
      totalHectaresRestoredSum: entity.totalHectaresRestoredSum,
      totalHectaresRestoredGoal: entity.hectaresToRestoreGoal,
      treesRestoredCount: totalTreesRestoredCount,
      treesGrownGoal: null,
      workdayCount: entity.frameworkKey == Framework.PPC ? entity.combinedWorkdayCount : entity.workdayCount
    }
  };
  const chartDataJobs = {
    chartData: [
      { name: t("JOBS CREATED"), value: attribMapping[keyAttribute].totalJobsCreated },
      {
        name: t("TOTAL JOBS CREATED GOAL"),
        value: attribMapping[keyAttribute].jobsCreatedGoal
      }
    ],
    cardValues: {
      label: t("Jobs Created"),
      value: attribMapping[keyAttribute].totalJobsCreated,
      totalName: t("TOTAL JOBS CREATED GOAL"),
      totalValue: attribMapping[keyAttribute].jobsCreatedGoal
    },
    graph: true,
    hectares: false
  };
  const chartDataHectares = {
    chartData: [
      {
        name: t("HECTARES RESTORED"),
        value: attribMapping[keyAttribute].totalHectaresRestoredSum,
        tooltipContent: "Number of hectares within approved polygons for this project"
      },
      {
        name: t("TOTAL HECTARES RESTORED"),
        value: parseFloat(attribMapping[keyAttribute].totalHectaresRestoredGoal)
      }
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: attribMapping[keyAttribute].totalHectaresRestoredSum,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].totalHectaresRestoredGoal)
    }
  };
  const chartDataTreesRestored = {
    chartData: [
      { name: t("TREES RESTORED"), value: attribMapping[keyAttribute].treesRestoredCount },
      {
        name: t("TOTAL TREES RESTORED"),
        value: parseFloat(attribMapping[keyAttribute].treesGrownGoal)
      }
    ],
    cardValues: {
      label: t("TREES RESTORED"),
      value: attribMapping[keyAttribute].treesRestoredCount,
      totalName: t("TOTAL TREES RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].treesGrownGoal)
    }
  };
  const chartDataWorkdays = {
    chartData: [
      {
        name: t("WORKDAYS CREATED"),
        value: attribMapping[keyAttribute].workdayCount
      }
    ],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: attribMapping[keyAttribute].workdayCount
    }
  };
  const chartDataSaplings = {
    chartData: [
      { name: t("SAPLINGS RESTORED"), value: attribMapping[keyAttribute].treesRestoredCount },
      {
        name: t("TOTAL SAPLINGS RESTORED"),
        value: parseFloat(attribMapping[keyAttribute].treesGrownGoal)
      }
    ],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: attribMapping[keyAttribute].treesRestoredCount,
      totalName: t("TOTAL SAPLINGS RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].treesGrownGoal)
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
        tooltipContent={project ? TOOLTIP_HECTARES_RESTORED_PROJECT : TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key={"terrafund-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={project}
        tooltipContent={project ? TOOLTIP_TREE_RESTORED_PROJECT : TOOLTIP_TREE_RESTORED_SITE}
      />
    ],
    ppc: [
      <ProgressDataCard
        key={"ppc-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        graph={project}
        hectares={true}
        tooltipContent={project ? TOOLTIP_HECTARES_RESTORED_PROJECT : TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key={"ppc-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={project}
        tooltipContent={project ? TOOLTIP_TREE_RESTORED_PROJECT : TOOLTIP_TREE_RESTORED_SITE}
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
        tooltipContent={project ? TOOLTIP_HECTARES_RESTORED_PROJECT : TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key={"hbf-3"}
        cardValues={chartDataSaplings.cardValues}
        chartData={chartDataSaplings}
        graph={project}
        tooltipContent={project ? TOOLTIP_SAPLING_RESTORED_PROJECT : TOOLTIP_SAPLING_RESTORED_SITE}
      />
    ]
  };
  const frameworkKey = entity.frameworkKey as Framework;
  const framework = isTerrafund(frameworkKey) ? Framework.TF : frameworkKey;
  const totalCountReplanting = usePlantTotalCount({
    entity: project ? "projects" : "sites",
    entityUuid: entity?.uuid,
    collection: "replanting"
  });

  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-4">
      {chartsDataMapping[framework as keyof ChartsData]?.map((chart, index) => (
        <React.Fragment key={index}>{chart}</React.Fragment>
      ))}
      <GoalProgressCard
        label={t("Trees restored")}
        value={totalTreesRestoredCount}
        limit={entity.treesGrownGoal}
        hasProgress={false}
        items={[
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: entity.treesPlantedCount,
            tooltipContent: project ? TOOLTIP_TREES_PLANTED_PROJECT : TOOLTIP_TREES_PLANTED_SITE,
            classNameLabelValue: "flex items-center gap-2"
          },
          {
            iconName: IconNames.LEAF_CIRCLE_PD,
            label: t("Seeds Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: entity.seedsPlantedCount,
            tooltipContent: project ? TOOLTIP_SEEDS_PLANTED_PROJECT : TOOLTIP_SEEDS_PLANTED_SITE
          },
          {
            iconName: IconNames.REFRESH_CIRCLE_PD,
            label: t("Trees Regenerating:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: treesFromReportsAnr,
            tooltipContent: project ? TOOLTIP_TREES_REGENERATING_PROJECT : TOOLTIP_TREES_REGENERATING_SITE
          },
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Replanted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: totalCountReplanting,
            tooltipContent: project ? TOOLTIP_TREES_REPLANTING_PROJECT : TOOLTIP_TREES_REPLANTING_SITE
          }
        ]}
        className="pr-[41px] lg:pr-[150px] mobile:w-[400px] mobile:!pr-0"
      />
    </div>
  );
};
export default GoalsAndProgressEntityTab;
