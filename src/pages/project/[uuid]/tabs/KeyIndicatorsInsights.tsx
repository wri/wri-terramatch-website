import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import {
  AreaHectaresIcon,
  JobsIcon,
  ProjectIcon,
  RegenerationIcon,
  SeedlingsIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";

import MetricCardsRow, {
  METRIC_CARD_CLASS_NAME
} from "../../../../components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import { useKeyIndicatorsTooltipContent } from "./constants/keyIndicatorsTooltipContent";

interface KeyIndicatorsInsightsProps {
  project: ProjectFullDto;
}

const KeyIndicatorsInsightsTab: FC<KeyIndicatorsInsightsProps> = ({ project }) => {
  const treesFromReportsAnr = project.regeneratedTreesCount ?? 0;
  const isCombinedTreesGrowingCard = project.frameworkKey === Framework.PPC || project.frameworkKey === Framework.HBF;
  const firstCardTreesProgress = isCombinedTreesGrowingCard
    ? (project.treesPlantedCount ?? 0) + (project.seedsPlantedCount ?? 0) + treesFromReportsAnr
    : project.treesPlantedCount ?? 0;
  const treesGrownGoal = project.treesGrownGoal ?? 0;
  const t = useT();
  const totalHectaresRestored = project.totalHectaresRestoredSum ?? 0;
  const totalHectaresRestoredGoal = project.totalHectaresRestoredGoal ?? 0;
  const hectaresTargetPercentage =
    totalHectaresRestoredGoal > 0 ? Math.round((totalHectaresRestored / totalHectaresRestoredGoal) * 100) : undefined;
  const framework = project?.frameworkKey;
  const keyIndicatorsTooltipContent = useKeyIndicatorsTooltipContent();

  const keyIndicatorsTooltipContentItem = useMemo(() => {
    return keyIndicatorsTooltipContent.find(content => content.frameworks.includes(project.frameworkKey!));
  }, [project.frameworkKey, keyIndicatorsTooltipContent]);

  const MAX_CARD = 4;

  return (
    <MetricCardsRow>
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}
        progress={firstCardTreesProgress}
        goal={treesGrownGoal}
        variant="donutChart"
        icon={<ProjectIcon />}
        color="secondary.600"
        type="treesRestored"
        className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
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
          progress={treesFromReportsAnr}
          goal={project.goalTreesRestoredAnr ?? 0}
          variant="donutChart"
          icon={<RegenerationIcon />}
          color="secondary.600"
          type="treesRegenerated"
          className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
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
          className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
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
          progress={project.treesToBeRestoredGoal ?? 0}
          goal={0}
          variant="large"
          icon={<TreeIcon />}
          color="secondary.600"
          type="treesToBeRestored"
          className={`${METRIC_CARD_CLASS_NAME(MAX_CARD)} !h-auto`}
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
        className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
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
          className={`${METRIC_CARD_CLASS_NAME(MAX_CARD)} !h-auto`}
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
          className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
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
    </MetricCardsRow>
  );
};

export default KeyIndicatorsInsightsTab;
