import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useResolutions } from "@/hooks/useResolutions";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, JobsIcon, SeedlingsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";
interface KeyIndicatorsInsightsProps {
  project: ProjectFullDto;
}

const KeyIndicatorsInsightsTab: FC<KeyIndicatorsInsightsProps> = ({ project }) => {
  const totalTreesRestoredCount =
    (project.treesPlantedCount ?? 0) + (project.regeneratedTreesCount ?? 0) + (project.seedsPlantedCount ?? 0);
  const treesGrownGoal = project.treesGrownGoal ?? 0;
  const t = useT();
  const { isLargerResolution, isSmallResolution } = useResolutions();
  const metricClassName = classNames("flex-1", { "w-[350px]": isLargerResolution });
  const totalHectaresRestored = project.totalHectaresRestoredSum ?? 0;
  const totalHectaresRestoredGoal = project.totalHectaresRestoredGoal ?? 0;
  const hectaresTargetPercentage =
    totalHectaresRestoredGoal > 0 ? Math.round((totalHectaresRestored / totalHectaresRestoredGoal) * 100) : undefined;

  return (
    <Flex gap={isSmallResolution ? 10 : 3} flex={1} justify={isLargerResolution ? "flex-start" : "space-between"}>
      <MetricCard
        title="Trees Planted"
        progress={totalTreesRestoredCount}
        goal={treesGrownGoal}
        variant="donutChart"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesRestored"
        className={metricClassName}
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t("Trees Planted")}</b>
            <br />
            {t("Number of trees planted for this project")}
          </Box>
        }
      />
      <MetricCard
        title="Seedlings Grown"
        progress={project.seedsPlantedCount ?? 0}
        goal={project.seedsGrownGoal ?? 0}
        variant="donutChart"
        icon={<SeedlingsIcon />}
        color="secondary.600"
        type="saplingsRestored"
        className={metricClassName}
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t("Seedlings Grown")}</b>
            <br />
            {t("Number of seedlings grown for this project")}
          </Box>
        }
      />
      <MetricCard
        title={t("Area Restored (ha)")}
        progress={totalHectaresRestored}
        goal={totalHectaresRestoredGoal}
        variant="donutChart"
        icon={<AreaHectaresIcon />}
        color="secondary.700"
        type="hectaresRestored"
        className={metricClassName}
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t("Area Restored (ha)")}</b>
            <br />
            {t("Number of hectares within approved polygons for this project")}
            {hectaresTargetPercentage != null && (
              <>
                <br />
                {t("{percentage}% of target", { percentage: hectaresTargetPercentage })}
              </>
            )}
          </Box>
        }
      />
      <MetricCard
        title="Jobs Created"
        progress={project.totalJobsCreated}
        goal={project.jobsCreatedGoal ?? 0}
        variant="donutChart"
        icon={<JobsIcon />}
        type="jobsCreated"
        className={metricClassName}
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t("Jobs Created")}</b>
            <br />
            {t("Number of jobs created for this project")}
          </Box>
        }
      />
    </Flex>
  );
};

export default KeyIndicatorsInsightsTab;
