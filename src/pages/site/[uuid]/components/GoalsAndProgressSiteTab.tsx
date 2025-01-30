import { useT } from "@transifex/react";
import React from "react";

import ProgressGoalsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { Framework } from "@/context/framework.provider";

interface GoalsAndProgressSiteTabProps {
  site: any;
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

const ChartData = (values: ChartDataItem) => {
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

const GoalsAndProgressSiteTab = ({ site }: GoalsAndProgressSiteTabProps) => {
  const t = useT();
  const totaTreesRestoredCount = site?.trees_planted_count + site?.regenerated_trees_count + site?.seeds_planted_count;
  const chartDataHectares = {
    chartData: [
      { name: t("HECTARES RESTORED"), value: site.total_hectares_restored_sum },
      site.framework_key !== Framework.PPC
        ? {
            name: t("TOTAL HECTARES RESTORED"),
            value: parseFloat(site.hectares_to_restore_goal)
          }
        : {}
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: site.total_hectares_restored_sum,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: parseFloat(site.hectares_to_restore_goal)
    }
  };
  const chartDataTreesRestored = {
    chartData: [{ name: t("TREES RESTORED"), value: totaTreesRestoredCount }],
    cardValues: {
      label: t("TREES RESTORED"),
      value: totaTreesRestoredCount
    }
  };
  const chartDataWorkdays = {
    chartData: [
      {
        name: t("WORKDAYS CREATED"),
        value: site.framework_key == Framework.PPC ? site.combined_workday_count : site.workday_count
      }
    ],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: site.framework_key == Framework.PPC ? site.combined_workday_count : site.workday_count
    }
  };
  const chartDataSaplings = {
    chartData: [{ name: t("SAPLINGS RESTORED"), value: totaTreesRestoredCount }],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: totaTreesRestoredCount
    }
  };

  const chartsDataMapping: ChartsData = {
    terrafund: [
      <ChartData
        key={"terrafund-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
      />,
      <ChartData
        key={"terrafund-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={false}
      />
    ],
    ppc: [
      <ChartData
        key={"ppc-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        graph={false}
        hectares={true}
      />,
      <ChartData
        key={"ppc-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={false}
      />,
      <ChartData key={"ppc-3"} cardValues={chartDataWorkdays.cardValues} chartData={chartDataWorkdays} graph={false} />
    ],
    hbf: [
      <ChartData key={"hbf-1"} cardValues={chartDataWorkdays.cardValues} chartData={chartDataWorkdays} graph={false} />,
      <ChartData
        key={"hbf-2"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
      />,
      <ChartData key={"hbf-3"} cardValues={chartDataSaplings.cardValues} chartData={chartDataSaplings} graph={false} />
    ]
  };
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-8">
      {chartsDataMapping[site.framework_key as keyof ChartsData].map((chart, index) => (
        <React.Fragment key={index}>{chart}</React.Fragment>
      ))}
      <GoalProgressCard
        label={t("Trees restored")}
        value={totaTreesRestoredCount}
        limit={site.trees_grown_goal}
        hasProgress={false}
        items={[
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: site.trees_planted_count
          },
          {
            iconName: IconNames.LEAF_CIRCLE_PD,
            label: t("Seeds Planted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: site.seeds_planted_count
          },
          {
            iconName: IconNames.REFRESH_CIRCLE_PD,
            label: t("Trees Regenerating:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: site.regenerated_trees_count
          }
        ]}
        className="pr-[41px] lg:pr-[150px]"
      />
    </div>
  );
};
export default GoalsAndProgressSiteTab;
