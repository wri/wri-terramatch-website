import { useT } from "@transifex/react";
import React from "react";

import ProgressGoalsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { ALL_TF, Framework } from "@/context/framework.provider";

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
      classNameLabel="text-neutral-650 uppercase mb-3"
      labelVariant="text-14"
      classNameCard="text-center flex flex-col items-center"
      classNameLabelValue="justify-center"
      chart={<ProgressGoalsDoughnutChart key={"items"} data={values.chartData} />}
    />
  );
};

const GoalsAndProgressEntityTab = ({ entity, project = false }: GoalsAndProgressEntityTabProps) => {
  const t = useT();
  const totaTreesRestoredCount =
    entity?.trees_planted_count + entity?.regenerated_trees_count + entity?.seeds_planted_count;
  const keyAttribute = project ? "project" : "site";
  const attribMapping: { [key: string]: any } = {
    project: {
      total_jobs_created: entity.total_jobs_created,
      jobs_created_goal: entity.jobs_created_goal,
      total_hectares_restored_sum: entity.total_hectares_restored_sum,
      total_hectares_restored_goal: entity.total_hectares_restored_goal,
      trees_restored_count: entity.trees_restored_count,
      trees_grown_goal: entity.trees_grown_goal,
      workday_count: entity.framework_key == Framework.PPC ? entity.combined_workday_count : entity.workday_count
    },
    site: {
      total_jobs_created: null,
      jobs_created_goal: null,
      total_hectares_restored_sum: entity.total_hectares_restored_sum,
      total_hectares_restored_goal: entity.hectares_to_restore_goal,
      trees_restored_count: entity?.trees_planted_count + entity?.regenerated_trees_count + entity?.seeds_planted_count,
      trees_grown_goal: null,
      workday_count: entity.framework_key == Framework.PPC ? entity.combined_workday_count : entity.workday_count
    }
  };
  const chartDataJobs = {
    chartData: [
      { name: t("JOBS CREATED"), value: attribMapping[keyAttribute].total_jobs_created },
      {
        name: t("TOTAL JOBS CREATED GOAL"),
        value: attribMapping[keyAttribute].jobs_created_goal
      }
    ],
    cardValues: {
      label: t("Jobs Created"),
      value: attribMapping[keyAttribute].total_jobs_created,
      totalName: t("TOTAL JOBS CREATED GOAL"),
      totalValue: attribMapping[keyAttribute].jobs_created_goal
    },
    graph: true,
    hectares: false
  };
  const chartDataHectares = {
    chartData: [
      { name: t("HECTARES RESTORED"), value: attribMapping[keyAttribute].total_hectares_restored_sum },
      {
        name: t("TOTAL HECTARES RESTORED"),
        value: parseFloat(attribMapping[keyAttribute].total_hectares_restored_goal)
      }
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: attribMapping[keyAttribute].total_hectares_restored_sum,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].total_hectares_restored_goal)
    }
  };
  const chartDataTreesRestored = {
    chartData: [
      { name: t("TREES RESTORED"), value: attribMapping[keyAttribute].trees_restored_count },
      {
        name: t("TOTAL TREES RESTORED"),
        value: parseFloat(attribMapping[keyAttribute].trees_grown_goal)
      }
    ],
    cardValues: {
      label: t("TREES RESTORED"),
      value: attribMapping[keyAttribute].trees_restored_count,
      totalName: t("TOTAL TREES RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].trees_grown_goal)
    }
  };
  const chartDataWorkdays = {
    chartData: [
      {
        name: t("WORKDAYS CREATED"),
        value: attribMapping[keyAttribute].workday_count
      }
    ],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: attribMapping[keyAttribute].workday_count
    }
  };
  const chartDataSaplings = {
    chartData: [
      { name: t("SAPLINGS RESTORED"), value: attribMapping[keyAttribute].trees_restored_count },
      {
        name: t("TOTAL SAPLINGS RESTORED"),
        value: parseFloat(attribMapping[keyAttribute].trees_grown_goal)
      }
    ],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: attribMapping[keyAttribute].trees_restored_count,
      totalName: t("TOTAL SAPLINGS RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].trees_grown_goal)
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
      />,
      <ProgressDataCard
        key={"terrafund-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={project}
      />
    ],
    ppc: [
      <ProgressDataCard
        key={"ppc-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        graph={project}
        hectares={true}
      />,
      <ProgressDataCard
        key={"ppc-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={project}
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
      />,
      <ProgressDataCard
        key={"hbf-3"}
        cardValues={chartDataSaplings.cardValues}
        chartData={chartDataSaplings}
        graph={project}
      />
    ]
  };
  const framework = ALL_TF.includes(entity.framework_key as Framework) ? "terrafund" : entity.framework_key;
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-8">
      {chartsDataMapping[framework as keyof ChartsData]?.map((chart, index) => (
        <React.Fragment key={index}>{chart}</React.Fragment>
      ))}
      <GoalProgressCard
        label={t("Trees restored")}
        value={project ? entity.trees_restored_count : totaTreesRestoredCount}
        limit={entity.trees_grown_goal}
        hasProgress={false}
        items={[
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: entity.trees_planted_count
          },
          {
            iconName: IconNames.LEAF_CIRCLE_PD,
            label: t("Seeds Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: entity.seeds_planted_count
          },
          {
            iconName: IconNames.REFRESH_CIRCLE_PD,
            label: t("Trees Regenerating:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: entity.regenerated_trees_count
          }
        ]}
        className="pr-[41px] lg:pr-[150px]"
      />
    </div>
  );
};
export default GoalsAndProgressEntityTab;
