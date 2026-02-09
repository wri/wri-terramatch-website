import { useT } from "@transifex/react";
import classNames from "classnames";

import { Flex } from "@chakra-ui/react";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectares, Jobs, Seeds, Tree } from "@/redesignComponents/foundations/Icons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface KeyIndicatorsInsightsProps {
  project: ProjectFullDto;
  isLargerResolution: boolean;
}

const KeyIndicatorsInsightsTab = ({ project, isLargerResolution }: KeyIndicatorsInsightsProps) => {
  const totalTreesRestoredCount =
    (project?.treesPlantedCount ?? 0) + (project?.regeneratedTreesCount ?? 0) + (project?.seedsPlantedCount ?? 0);

  const chartDataJobs = {
    cardValues: {
      value: project.totalJobsCreated,
      totalValue: project.jobsCreatedGoal ?? 0
    }
  };
  const chartDataHectares = {
    cardValues: {
      value: project.totalHectaresRestoredSum,
      totalValue: project.totalHectaresRestoredGoal ?? 0
    }
  };
  const chartDataTreesRestored = {
    cardValues: {
      value: totalTreesRestoredCount,
      totalValue: project.treesGrownGoal ?? 0
    }
  };
  const chartDataSaplings = {
    cardValues: {
      value: totalTreesRestoredCount,
      totalValue: project.treesGrownGoal ?? 0
    }
  };

  return (
    <Flex gap={10} flex={1} justify={isLargerResolution ? "flex-start" : "space-between"}>
      <MetricCard
        title="Trees Planted"
        progress={chartDataTreesRestored.cardValues.value}
        goal={chartDataTreesRestored.cardValues.totalValue}
        variant="donutChart"
        icon={<Tree />}
        color="secondary.600"
        type="treesRestored"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
      <MetricCard
        title="Seedlings Grown"
        progress={chartDataSaplings.cardValues.value}
        goal={chartDataSaplings.cardValues.totalValue}
        variant="donutChart"
        icon={<Seeds />}
        color="secondary.600"
        type="saplingsRestored"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
      <MetricCard
        title="Hectares Restored"
        progress={chartDataHectares.cardValues.value}
        goal={chartDataHectares.cardValues.totalValue}
        variant="donutChart"
        icon={<AreaHectares />}
        color="secondary.700"
        type="hectaresRestored"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
      <MetricCard
        title="Jobs Created"
        progress={chartDataJobs.cardValues.value}
        goal={chartDataJobs.cardValues.totalValue}
        variant="donutChart"
        icon={<Jobs />}
        type="jobsCreated"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
    </Flex>
  );
};

export default KeyIndicatorsInsightsTab;
