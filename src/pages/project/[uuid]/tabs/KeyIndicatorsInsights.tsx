import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";

import { useTrackings } from "@/connections/EntityAssociation";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import { ProjectFullDto, TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import {
  AreaHectaresIcon,
  JobsIcon,
  ProjectIcon,
  RegenerationIcon,
  SeedlingsIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";
interface KeyIndicatorsInsightsProps {
  project: ProjectFullDto;
}

function computeTreesGrownFromTrackings(entries: TrackingEntryDto[], survivalRate: number | null | undefined): number {
  let treesPlanted = 0;
  let treesRegenerated = 0;
  for (const e of entries) {
    if (e.type === "years") treesPlanted += e.amount;
    if (e.type === "strategy" && e.subtype === "anr") treesRegenerated += e.amount;
  }
  const rate = survivalRate ?? 0;
  return Math.round(treesPlanted * (rate / 100) + treesRegenerated);
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

  const [, { data: trackings }] = useTrackings({
    entity: "projects",
    uuid: project?.uuid ?? "",
    enabled: framework == "terra-fund-3" || framework == Framework.TF_3
  });

  const treesGrownTf3 = useMemo(() => {
    if (!(framework == "terra-fund-3" || framework == Framework.TF_3)) return null;
    const treesGoalTrackings = trackings?.filter(
      t => t.domain === "restoration" && t.type === "trees-goal" && t.collection === "all"
    );
    const allEntries = treesGoalTrackings?.flatMap(t => t?.entries ?? []);
    return computeTreesGrownFromTrackings(allEntries ?? [], project?.survivalRate ?? 0);
  }, [framework, trackings, project?.survivalRate]);

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
        icon={<ProjectIcon />}
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
      {(project?.frameworkKey == "terra-fund-3" || project?.frameworkKey == Framework.TF_3) && (
        <MetricCard
          title={t("Trees to be restored")}
          progress={treesGrownTf3 ?? 0}
          goal={0}
          variant="large"
          icon={<TreeIcon />}
          color="secondary.600"
          type="treesToBeRestored"
          className={metricClassName + " !h-auto"}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t("Trees to be restored")}</b>
              <br />
              {t("Number of trees to be restored for this project")}
            </Box>
          }
        />
      )}
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
