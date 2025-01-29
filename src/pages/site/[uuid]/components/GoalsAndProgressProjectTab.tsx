import { useT } from "@transifex/react";
import React from "react";

import ProgressGoalsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { Framework } from "@/context/framework.provider";

interface GoalsAndProgressProjectTabProps {
  project: any;
}
interface ChartDataItem {
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

const CharData = (values: ChartDataItem) => {
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

const GoalsAndProgressProjectTab = ({ project }: GoalsAndProgressProjectTabProps) => {
  const t = useT();
  console.log("project", project, parseFloat(project.total_hectares_restored_goal));
  const chartDataJobs = {
    chartData: [
      { name: t("JOBS CREATED"), value: project.total_jobs_created },
      {
        name: t("TOTAL JOBS CREATED GOAL"),
        value: project.jobs_created_goal
      }
    ],
    cardValues: {
      label: t("Jobs Created"),
      value: project.total_jobs_created,
      totalName: t("TOTAL JOBS CREATED GOAL"),
      totalValue: project.jobs_created_goal
    },
    graph: true,
    hectares: false
  };
  const chartDataHectares = {
    chartData: [
      { name: t("HECTARES RESTORED"), value: project.total_hectares_restored_sum },
      {
        name: t("TOTAL HECTARES RESTORED"),
        value: parseFloat(project.total_hectares_restored_goal)
      }
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: project.total_hectares_restored_sum,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: parseFloat(project.total_hectares_restored_goal)
    },
    graph: true
  };
  const chartDataTreesRestored = {
    chartData: [
      { name: t("TREES RESTORED"), value: project.trees_restored_count },
      {
        name: t("TOTAL TREES RESTORED"),
        value: parseFloat(project.trees_grown_goal)
      }
    ],
    cardValues: {
      label: t("TREES RESTORED"),
      value: project.trees_restored_count,
      totalName: t("TOTAL TREES RESTORED"),
      totalValue: parseFloat(project.trees_grown_goal)
    },
    graph: true
  };
  const chartDataWorkdays = {
    chartData: [
      {
        name: t("WORKDAYS CREATED"),
        value: project.framework_key == Framework.PPC ? project.combined_workday_count : project.workday_count
      }
    ],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: project.framework_key == Framework.PPC ? project.combined_workday_count : project.workday_count
    }
  };
  const chartDataSaplings = {
    chartData: [{ name: t("SAPLINGS RESTORED"), value: project.sapling_species_count }],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: project.sapling_species_count
    }
  };

  const chartsDataMapping: ChartsData = {
    terrafund: [
      <CharData
        key={"terrafund-0"}
        cardValues={chartDataJobs.cardValues}
        chartData={chartDataJobs}
        graph={chartDataJobs.graph}
        hectares={chartDataJobs.hectares}
      />,
      <CharData
        key={"terrafund-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
        graph={chartDataHectares.graph}
      />,
      <CharData
        key={"terrafund-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={chartDataTreesRestored.graph}
      />
    ],
    ppc: [
      <CharData
        key={"ppc-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
        graph={chartDataHectares.graph}
      />,
      <CharData
        key={"ppc-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={chartDataTreesRestored.graph}
      />,
      <CharData key={"ppc-3"} cardValues={chartDataWorkdays.cardValues} chartData={chartDataWorkdays} graph={false} />
    ],
    hbf: [
      <CharData key={"hbf-1"} cardValues={chartDataWorkdays.cardValues} chartData={chartDataWorkdays} graph={false} />,
      <CharData
        key={"hbf-2"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
      />,
      <CharData key={"hbf-3"} cardValues={chartDataSaplings.cardValues} chartData={chartDataSaplings} graph={false} />
    ]
  };
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-8">
      {chartsDataMapping[project.framework_key as keyof ChartsData].map((chart, index) => (
        <React.Fragment key={index}>{chart}</React.Fragment>
      ))}
      <GoalProgressCard
        label={t("Trees restored")}
        value={project.trees_restored_count}
        limit={project.trees_grown_goal}
        hasProgress={false}
        items={[
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: project.trees_planted_count
          },
          {
            iconName: IconNames.LEAF_CIRCLE_PD,
            label: t("Seeds Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: project.seeds_planted_count
          },
          {
            iconName: IconNames.REFRESH_CIRCLE_PD,
            label: t("Trees Regenerating:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: project.regenerated_trees_count
          }
        ]}
        className="pr-[41px] lg:pr-[150px]"
      />
    </div>
  );
};
export default GoalsAndProgressProjectTab;
