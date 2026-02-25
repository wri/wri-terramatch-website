import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import { Framework } from "@/context/framework.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useResolutions } from "@/hooks/useResolutions";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectares, Jobs, Seeds, Tree } from "@/redesignComponents/foundations/Icons";
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
  const isTf3Project = project.frameworkKey === Framework.TF_3;

  return (
    <Flex gap={isSmallResolution ? 10 : 3} flex={1} justify={isLargerResolution ? "flex-start" : "space-between"}>
      <MetricCard
        title="Trees Planted"
        progress={totalTreesRestoredCount}
        goal={treesGrownGoal}
        variant="donutChart"
        icon={<Tree />}
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
        icon={<Seeds />}
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
      {isTf3Project && (
        <MetricCard
          title="Trees Grown"
          progress={0}
          goal={treesGrownGoal}
          variant="donutChart"
          icon={<Tree />}
          color="secondary.700"
          type="treesGrown"
          className={metricClassName}
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t("Trees Grown")}</b>
              <br />
              {t(
                "Final contract figure for this TerraFund Cohort 3 project: (Trees Planted Goal × Project Survival Rate) + Trees Regenerated Goal."
              )}
            </Box>
          }
        />
      )}
      {!isTf3Project && (
        <MetricCard
          title="Trees Regenerated"
          progress={project.regeneratedTreesCount ?? 0}
          goal={project.goalTreesRestoredAnr ?? 0}
          variant="donutChart"
          icon={<Tree />}
          color="secondary.600"
          type="treesRegenerated"
        />
      )}
      {!isTf3Project && (
        <MetricCard
          title="Seeds Planted"
          progress={project.seedsPlantedCount ?? 0}
          goal={project.seedsGrownGoal ?? 0}
          variant="donutChart"
          icon={<Seeds />}
          color="secondary.600"
          type="seedsPlanted"
        />
      )}
      <MetricCard
        title={t("Area Restored (ha)")}
        progress={totalHectaresRestored}
        goal={totalHectaresRestoredGoal}
        variant="donutChart"
        icon={<AreaHectares />}
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
        icon={<Jobs />}
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
