import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React from "react";

import KeyIndicatorsInsightsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/KeyIndicatorsInsightsDoughnutChart";
import KeyIndicatorsInsightsCard from "@/components/elements/Cards/GoalProgressCard/KeyIndicatorsInsightsCard";
import { Framework } from "@/context/framework.provider";
import { getThemedColor } from "@/lib/theme";
import { AreaHectares, Jobs, Seeds, Tree } from "@/redesignComponents/foundations/Icons";

import {
  TOOLTIP_HECTARES_RESTORED_PROJECT,
  TOOLTIP_HECTARES_RESTORED_SITE,
  TOOLTIP_SAPLING_RESTORED_PROJECT,
  TOOLTIP_SAPLING_RESTORED_SITE,
  TOOLTIP_TREE_RESTORED_PROJECT,
  TOOLTIP_TREE_RESTORED_SITE
} from "./constants";

interface KeyIndicatorsInsightsEntityTabProps {
  entity: any;
  project?: boolean;
}
interface KeyIndicatorsInsightsDataCardItem {
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
  icon?: React.ReactNode;
  iconColor?: string;
}

const KeyIndicatorsInsightsDataCard = (values: KeyIndicatorsInsightsDataCardItem) => {
  return (
    <KeyIndicatorsInsightsCard
      label={values.cardValues.label}
      value={values.cardValues.value}
      totalValue={values.cardValues.totalValue}
      hectares={values.hectares}
      graph={values.graph}
      classNameCard="text-center flex flex-col items-center"
      classNameLabelValue="justify-center"
      tootipContent={values.tooltipContent ? values.tooltipContent : undefined}
      tooltipTitle={values.tooltipContent ? values.cardValues.label : undefined}
      chart={
        <KeyIndicatorsInsightsDoughnutChart
          key={"items"}
          data={values.chartData}
          icon={values.icon}
          color={values.iconColor}
        />
      }
    />
  );
};

const KeyIndicatorsInsightsEntityTab = ({ entity, project = false }: KeyIndicatorsInsightsEntityTabProps) => {
  const t = useT();
  const totalTreesRestoredCount = entity?.treesPlantedCount + entity?.regeneratedTreesCount + entity?.seedsPlantedCount;
  const keyAttribute = "project";
  const attribMapping: { [key: string]: any } = {
    project: {
      total_jobs_created: entity.totalJobsCreated,
      jobs_created_goal: entity.jobsCreatedGoal,
      total_hectares_restored_sum:
        project && entity.frameworkKey == Framework.PPC
          ? Math.round(entity.totalHectaresRestoredSum)
          : entity.totalHectaresRestoredSum,
      total_hectares_restored_goal: entity.totalHectaresRestoredGoal,
      trees_restored_count: totalTreesRestoredCount,
      trees_grown_goal: entity.treesGrownGoal,
      workday_count: entity.frameworkKey == Framework.PPC ? entity.combinedWorkdayCount : entity.workdayCount
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
      {
        name: t("HECTARES RESTORED"),
        value: attribMapping[keyAttribute].total_hectares_restored_sum,
        tooltipContent: "Number of hectares within approved polygons for this project"
      },
      {
        name: t("TOTAL HECTARES RESTORED"),
        value: parseFloat(attribMapping[keyAttribute].total_hectares_restored_goal)
      }
    ],
    cardValues: {
      label: t("Hectares Restored"),
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
      label: t("Trees Restored"),
      value: attribMapping[keyAttribute].trees_restored_count,
      totalName: t("TOTAL TREES RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].trees_grown_goal)
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
      label: t("Saplings Restored"),
      value: attribMapping[keyAttribute].trees_restored_count,
      totalName: t("TOTAL SAPLINGS RESTORED"),
      totalValue: parseFloat(attribMapping[keyAttribute].trees_grown_goal)
    }
  };

  const chartsDataMapping = [
    <KeyIndicatorsInsightsDataCard
      key={"ppc-1"}
      cardValues={chartDataTreesRestored.cardValues}
      chartData={chartDataTreesRestored}
      graph={project}
      tooltipContent={project ? TOOLTIP_TREE_RESTORED_PROJECT : TOOLTIP_TREE_RESTORED_SITE}
      icon={<Tree boxSize={5} color="#7BBD31" />}
      iconColor="#7BBD31"
    />,
    <KeyIndicatorsInsightsDataCard
      key={"ppc-2"}
      cardValues={chartDataSaplings.cardValues}
      chartData={chartDataSaplings}
      graph={project}
      tooltipContent={project ? TOOLTIP_SAPLING_RESTORED_PROJECT : TOOLTIP_SAPLING_RESTORED_SITE}
      icon={<Seeds boxSize={5} color="#7BBD31" />}
      iconColor="#7BBD31"
    />,
    <KeyIndicatorsInsightsDataCard
      key={"ppc-3"}
      cardValues={chartDataHectares.cardValues}
      chartData={chartDataHectares}
      graph={project}
      hectares={true}
      tooltipContent={project ? TOOLTIP_HECTARES_RESTORED_PROJECT : TOOLTIP_HECTARES_RESTORED_SITE}
      icon={<AreaHectares boxSize={5} color="#477010" />}
      iconColor="#477010"
    />,
    <KeyIndicatorsInsightsDataCard
      key={"ppc-4"}
      cardValues={chartDataJobs.cardValues}
      chartData={chartDataJobs}
      graph={chartDataJobs.graph}
      hectares={chartDataJobs.hectares}
      icon={<Jobs boxSize={5} color="#50b6e2" />}
      iconColor="#50b6e2"
    />
  ];

  return (
    <>
      {chartsDataMapping.map((chart, index) => (
        <Box
          padding={3}
          borderRadius={8}
          border={`1px solid ${getThemedColor("neutral", 300)}`}
          height="fit-content"
          key={index + "chart"}
        >
          {chart}
        </Box>
      ))}
    </>
  );
};

export default KeyIndicatorsInsightsEntityTab;
