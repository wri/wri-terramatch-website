import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
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

import KeyIndicatorsInsightsRow, {
  METRIC_CARD_CLASS_NAME
} from "../../../../components/extensive/PageElements/KeyIndicatorsInsightsRow/KeyIndicatorsInsightsRow";
import { KEY_INDICATORS_TOOLTIP_CONTENT } from "./constants/keyIndicatorsTooltipContent";

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

  const keyIndicatorsTooltipContentItem = useMemo(() => {
    return KEY_INDICATORS_TOOLTIP_CONTENT.find(content => content.frameworks.includes(project.frameworkKey!));
  }, [project.frameworkKey]);

  return (
    <KeyIndicatorsInsightsRow>
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}
        progress={totalTreesRestoredCount}
        goal={treesGrownGoal}
        variant="donutChart"
        icon={<ProjectIcon />}
        color="secondary.600"
        type="treesRestored"
        className={METRIC_CARD_CLASS_NAME}
        classNameTitle="whitespace-nowrap"
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}</b>
            <br />
            {t(`${keyIndicatorsTooltipContentItem?.treesRestored.content}`)}
          </Box>
        }
      />
      <ContextCondition frameworksHide={[Framework.PPC, Framework.HBF]}>
        <MetricCard
          title={t(`${keyIndicatorsTooltipContentItem?.treesRegenerated.title}`)}
          progress={project.regeneratedTreesCount ?? 0}
          goal={project.goalTreesRestoredAnr ?? 0}
          variant="donutChart"
          icon={<RegenerationIcon />}
          color="secondary.600"
          type="treesRegenerated"
          className={METRIC_CARD_CLASS_NAME}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(`${keyIndicatorsTooltipContentItem?.treesRegenerated.title}`)}</b>
              <br />
              {t(`${keyIndicatorsTooltipContentItem?.treesRegenerated.content}`)}
            </Box>
          }
        />
        <MetricCard
          title={t(`${keyIndicatorsTooltipContentItem?.saplingsRestored.title}`)}
          progress={project.seedsPlantedCount ?? 0}
          goal={project.seedsGrownGoal ?? 0}
          variant="donutChart"
          icon={<SeedlingsIcon />}
          color="secondary.600"
          type="saplingsRestored"
          className={METRIC_CARD_CLASS_NAME}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(`${keyIndicatorsTooltipContentItem?.saplingsRestored.title}`)}</b>
              <br />
              {t(`${keyIndicatorsTooltipContentItem?.saplingsRestored.content}`)}
            </Box>
          }
        />
      </ContextCondition>
      {(project?.frameworkKey == "terra-fund-3" || project?.frameworkKey == Framework.TF_3) && (
        <MetricCard
          title={t(`${keyIndicatorsTooltipContentItem?.treesToBeRestored.title}`)}
          progress={treesGrownTf3 ?? 0}
          goal={0}
          variant="large"
          icon={<TreeIcon />}
          color="secondary.600"
          type="treesToBeRestored"
          className={`${METRIC_CARD_CLASS_NAME} !h-auto`}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(`${keyIndicatorsTooltipContentItem?.treesToBeRestored.title}`)}</b>
              <br />
              {t(`${keyIndicatorsTooltipContentItem?.treesToBeRestored.content}`)}
            </Box>
          }
        />
      )}
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.hectaresRestored.title}`)}
        progress={totalHectaresRestored}
        goal={totalHectaresRestoredGoal}
        variant="donutChart"
        icon={<AreaHectaresIcon />}
        color="secondary.700"
        type="hectaresRestored"
        className={METRIC_CARD_CLASS_NAME}
        classNameTitle="whitespace-nowrap"
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t(`${keyIndicatorsTooltipContentItem?.hectaresRestored.title}`)}</b>
            <br />
            {t(`${keyIndicatorsTooltipContentItem?.hectaresRestored.content}`)}
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
          title={t(`${keyIndicatorsTooltipContentItem?.jobsCreated.title}`)}
          progress={framework === Framework.PPC ? project.combinedWorkdayCount : project.totalJobsCreated}
          goal={project.jobsCreatedGoal ?? 0}
          variant="large"
          icon={<JobsIcon />}
          type="jobsCreated"
          className={`${METRIC_CARD_CLASS_NAME} !h-auto`}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(`${keyIndicatorsTooltipContentItem?.jobsCreated.title}`)}</b>
              <br />
              {t(`${keyIndicatorsTooltipContentItem?.jobsCreated.content}`)}
            </Box>
          }
          frameworkKey={framework!}
        />
      ) : (
        <MetricCard
          title={t(`${keyIndicatorsTooltipContentItem?.jobsCreated.title}`)}
          progress={project.totalJobsCreated}
          goal={project.jobsCreatedGoal ?? 0}
          variant="donutChart"
          icon={<JobsIcon />}
          type="jobsCreated"
          className={METRIC_CARD_CLASS_NAME}
          classNameTitle="whitespace-nowrap"
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(`${keyIndicatorsTooltipContentItem?.jobsCreated.title}`)}</b>
              <br />
              {t(`${keyIndicatorsTooltipContentItem?.jobsCreated.content}`)}
            </Box>
          }
          frameworkKey={framework!}
        />
      )}
    </KeyIndicatorsInsightsRow>
  );
};

export default KeyIndicatorsInsightsTab;
