import { useT } from "@transifex/react";
import classNames from "classnames";

import { Flex } from "@chakra-ui/react";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectares, Jobs, Seeds, Tree } from "@/redesignComponents/foundations/Icons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { FC } from "react";

interface KeyIndicatorsInsightsProps {
  project: ProjectFullDto;
  isLargerResolution: boolean;
}

const KeyIndicatorsInsightsTab: FC<KeyIndicatorsInsightsProps> = ({ project, isLargerResolution }) => {
  const totalTreesRestoredCount =
    (project.treesPlantedCount ?? 0) + (project.regeneratedTreesCount ?? 0) + (project.seedsPlantedCount ?? 0);
  const treesGrownGoal = project.treesGrownGoal ?? 0;

  return (
    <Flex gap={10} flex={1} justify={isLargerResolution ? "flex-start" : "space-between"}>
      <MetricCard
        title="Trees Planted"
        progress={totalTreesRestoredCount}
        goal={treesGrownGoal}
        variant="donutChart"
        icon={<Tree />}
        color="secondary.600"
        type="treesRestored"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
      <MetricCard
        title="Seedlings Grown"
        progress={totalTreesRestoredCount}
        goal={treesGrownGoal}
        variant="donutChart"
        icon={<Seeds />}
        color="secondary.600"
        type="saplingsRestored"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
      <MetricCard
        title="Hectares Restored"
        progress={project.totalHectaresRestoredSum}
        goal={project.totalHectaresRestoredGoal ?? 0}
        variant="donutChart"
        icon={<AreaHectares />}
        color="secondary.700"
        type="hectaresRestored"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
      <MetricCard
        title="Jobs Created"
        progress={project.totalJobsCreated}
        goal={project.jobsCreatedGoal ?? 0}
        variant="donutChart"
        icon={<Jobs />}
        type="jobsCreated"
        className={classNames({ "flex-1": !isLargerResolution })}
      />
    </Flex>
  );
};

export default KeyIndicatorsInsightsTab;
