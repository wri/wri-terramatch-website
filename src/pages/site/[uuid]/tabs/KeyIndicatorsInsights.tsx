import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import MetricCardsRow, {
  METRIC_CARD_CLASS_NAME
} from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { MetricCardVariant } from "@/redesignComponents/dataDisplay/Metrics/types";
import {
  AreaHectaresIcon,
  JobsIcon,
  RegenerationIcon,
  SeedlingsIcon,
  SurvivalRateIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";

import { KEY_INDICATORS_TOOLTIP_CONTENT } from "./constants/keyIndicatorsTooltipContent";

interface KeyIndicatorsInsightsProps {
  site: SiteFullDto;
}

const KeyIndicatorsInsightsTab: FC<KeyIndicatorsInsightsProps> = ({ site }) => {
  const t = useT();

  const framework = site?.frameworkKey;
  const treesFromReportsAnr = site.regeneratedTreesCount ?? 0;
  const isCombinedTreesGrowingCard = framework === Framework.PPC || framework === Framework.HBF;
  const treesGrowingCardProgress = isCombinedTreesGrowingCard
    ? (site.treesPlantedCount ?? 0) + (site.seedsPlantedCount ?? 0) + treesFromReportsAnr
    : site.treesPlantedCount ?? 0;

  const keyIndicatorsTooltipContentItem = useMemo(() => {
    return KEY_INDICATORS_TOOLTIP_CONTENT.find(content => content.frameworks.includes(site.frameworkKey!));
  }, [site.frameworkKey]);

  const MAX_CARD = 5;

  return (
    <MetricCardsRow>
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}
        progress={treesGrowingCardProgress}
        goal={0}
        variant={keyIndicatorsTooltipContentItem?.treesRestored.type as MetricCardVariant}
        icon={<TreeIcon />}
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
        <ContextCondition frameworksHide={ALL_TF.concat(Framework.EPA_GHANA_PILOT)}>
          <MetricCard
            className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
            title={t(`${keyIndicatorsTooltipContentItem?.saplingsRestored.title}`)}
            variant="large"
            progress={site.seedsPlantedCount ?? 0}
            goal={0}
            icon={<SeedlingsIcon />}
            tooltipContent={
              <Box fontSize="14px" lineHeight="20px">
                <b>{t(`${keyIndicatorsTooltipContentItem?.saplingsRestored.title}`)}</b>
                <br />
                {t(`${keyIndicatorsTooltipContentItem?.saplingsRestored.content}`)}
              </Box>
            }
            color="secondary.600"
          />
        </ContextCondition>
        <MetricCard
          className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
          title={t(`${keyIndicatorsTooltipContentItem?.treesRegenerated.title}`)}
          variant="large"
          progress={treesFromReportsAnr}
          goal={0}
          icon={<RegenerationIcon />}
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(`${keyIndicatorsTooltipContentItem?.treesRegenerated.title}`)}</b>
              <br />
              {t(`${keyIndicatorsTooltipContentItem?.treesRegenerated.content}`)}
            </Box>
          }
          color="secondary.600"
        />
        <MetricCard
          className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
          title={t("Survival Rate")}
          variant="large"
          progress={site.lastReportedSurvivalRate ?? 0}
          goal={0}
          icon={<SurvivalRateIcon />}
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t("Survival Rate")}</b>
              <br />
              {t("This is the percentage of planted trees that are currently surviving across this site.")}
            </Box>
          }
          color="secondary.600"
        />
      </ContextCondition>
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.hectaresRestored.title}`)}
        progress={site.hectaresRestoredPolygonsCount ?? 0}
        goal={site.hectaresToRestoreGoal ?? 0}
        variant={keyIndicatorsTooltipContentItem?.hectaresRestored.type as MetricCardVariant}
        icon={<AreaHectaresIcon />}
        color="secondary.700"
        type="hectaresRestored"
        className={METRIC_CARD_CLASS_NAME(MAX_CARD)}
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t(`${keyIndicatorsTooltipContentItem?.hectaresRestored.title}`)}</b>
            <br />
            {t(`${keyIndicatorsTooltipContentItem?.hectaresRestored.content}`)}
          </Box>
        }
      />
      <ContextCondition frameworksShow={[Framework.PPC]}>
        <MetricCard
          title={t(`${keyIndicatorsTooltipContentItem?.jobsCreated.title}`)}
          progress={site.combinedWorkdayCount}
          goal={0}
          variant={keyIndicatorsTooltipContentItem?.jobsCreated.type as MetricCardVariant}
          icon={<JobsIcon />}
          type="jobsCreated"
          className={METRIC_CARD_CLASS_NAME(MAX_CARD) + " !h-auto"}
          tooltipContent={
            <Box fontSize="14px" lineHeight="20px">
              <b>{t(`${keyIndicatorsTooltipContentItem?.jobsCreated.title}`)}</b>
              <br />
              {t(`${keyIndicatorsTooltipContentItem?.jobsCreated.content}`)}
            </Box>
          }
          frameworkKey={framework!}
        />
      </ContextCondition>
    </MetricCardsRow>
  );
};

export default KeyIndicatorsInsightsTab;
