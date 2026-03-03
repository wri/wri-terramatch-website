import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import {
  AreaHectaresIcon,
  JobsIcon,
  RegenerationIcon,
  SeedlingsIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";
interface KeyIndicatorsInsightsProps {
  project: ProjectFullDto;
}

const KeyIndicatorsInsightsTab: FC<KeyIndicatorsInsightsProps> = ({ project }) => {
  const totalTreesRestoredCount =
    (project.treesPlantedCount ?? 0) + (project.regeneratedTreesCount ?? 0) + (project.seedsPlantedCount ?? 0);
  const treesGrownGoal = project.treesGrownGoal ?? 0;
  const t = useT();
  const metricClassName = classNames(
    "flex-1 max-w-[calc((100%/2)-6px)] ws-1100:max-w-[calc((100%/3)-6px)] md:!max-w-[calc((100%/4)-6px)] lg:!max-w-[calc((100%/4)-1rem)] w-[350px]"
  );
  const totalHectaresRestored = project.totalHectaresRestoredSum ?? 0;
  const totalHectaresRestoredGoal = project.totalHectaresRestoredGoal ?? 0;
  const hectaresTargetPercentage =
    totalHectaresRestoredGoal > 0 ? Math.round((totalHectaresRestored / totalHectaresRestoredGoal) * 100) : undefined;
  const framework = project?.frameworkKey;

  return (
    <Flex flex={1} flexWrap="wrap" className="gap-x-3 gap-y-3 lg:gap-x-8 lg:gap-y-8" justify={"flex-start"}>
      <MetricCard
        title={t(
          framework === Framework.PPC
            ? "Trees Growing"
            : framework === Framework.HBF
            ? "Saplings Growing"
            : "Trees Planted"
        )}
        progress={totalTreesRestoredCount}
        goal={treesGrownGoal}
        variant="donutChart"
        icon={<TreeIcon />}
        color="secondary.600"
        type="treesRestored"
        className={metricClassName}
        classNameTitle="whitespace-nowrap"
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t("Trees Planted")}</b>
            <br />
            {t("Number of trees planted for this project")}
          </Box>
        }
      />
      <ContextCondition frameworksHide={[Framework.PPC, Framework.HBF]}>
        <MetricCard
          title={t("Trees Regenerated")}
          progress={project.regeneratedTreesCount ?? 0}
          goal={project.goalTreesRestoredAnr ?? 0}
          variant="donutChart"
          icon={<RegenerationIcon />}
          color="secondary.600"
          type="treesRestored"
          className={metricClassName}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t("Trees Regenerated")}</b>
              <br />
              {t("Number of trees regenerated for this project")}
            </Box>
          }
        />
        <MetricCard
          title={t("Seedlings Grown")}
          progress={project.seedsPlantedCount ?? 0}
          goal={project.seedsGrownGoal ?? 0}
          variant="donutChart"
          icon={<SeedlingsIcon />}
          color="secondary.600"
          type="saplingsRestored"
          className={metricClassName}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t("Seedlings Grown")}</b>
              <br />
              {t("Number of seedlings grown for this project")}
            </Box>
          }
        />
      </ContextCondition>
      <MetricCard
        title={t("Area Restored (ha)")}
        progress={totalHectaresRestored}
        goal={totalHectaresRestoredGoal}
        variant="donutChart"
        icon={<AreaHectaresIcon />}
        color="secondary.700"
        type="hectaresRestored"
        className={metricClassName}
        classNameTitle="whitespace-nowrap"
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
      {framework === Framework.PPC ? (
        <MetricCard
          title={t(framework === Framework.PPC ? "Workdays Created" : "Jobs Created")}
          progress={framework === Framework.PPC ? project.combinedWorkdayCount : project.totalJobsCreated}
          goal={project.jobsCreatedGoal ?? 0}
          variant="large"
          icon={<JobsIcon />}
          type="jobsCreated"
          className={metricClassName + " !h-auto"}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(framework === Framework.PPC ? "Workdays Created" : "Jobs Created")}</b>
              <br />
              {t(
                framework === Framework.PPC
                  ? "Number of workdays created for this project"
                  : "Number of jobs created for this project"
              )}
            </Box>
          }
          frameworkKey={framework!}
        />
      ) : (
        <MetricCard
          title={t("Jobs Created")}
          progress={project.totalJobsCreated}
          goal={project.jobsCreatedGoal ?? 0}
          variant="donutChart"
          icon={<JobsIcon />}
          type="jobsCreated"
          className={metricClassName}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t("Jobs Created")}</b>
              <br />
              {t("Number of jobs created for this project")}
            </Box>
          }
          frameworkKey={framework!}
        />
      )}
    </Flex>
  );
};

export default KeyIndicatorsInsightsTab;
