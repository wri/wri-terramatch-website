import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import MetricCardsRow, {
  METRIC_CARD_CLASS_NAME
} from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow ";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { MetricCardVariant } from "@/redesignComponents/dataDisplay/Metrics/types";
import {
  AreaHectaresIcon,
  JobsIcon,
  ProjectIcon,
  RegenerationIcon,
  SeedlingsIcon,
  SurvivalRateIcon
} from "@/redesignComponents/foundations/Icons";

import { KEY_INDICATORS_TOOLTIP_CONTENT } from "./constants/keyIndicatorsTooltipContent";

interface KeyIndicatorsInsightsProps {
  site: SiteFullDto;
}

const KeyIndicatorsInsightsTab: FC<KeyIndicatorsInsightsProps> = ({ site }) => {
  const t = useT();

  const framework = site?.frameworkKey;

  const keyIndicatorsTooltipContentItem = useMemo(() => {
    return KEY_INDICATORS_TOOLTIP_CONTENT.find(content => content.frameworks.includes(site.frameworkKey!));
  }, [site.frameworkKey]);

  return (
    <MetricCardsRow>
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}
        progress={site.treesPlantedCount ?? 0}
        goal={0}
        variant={keyIndicatorsTooltipContentItem?.treesRestored.type as MetricCardVariant}
        icon={<ProjectIcon />}
        color="secondary.600"
        type="treesRestored"
        className={METRIC_CARD_CLASS_NAME}
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}</b>
            <br />
            {t(`${keyIndicatorsTooltipContentItem?.treesRestored.content}`)}
          </Box>
        }
      />
      <MetricCard
        className={METRIC_CARD_CLASS_NAME}
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
      <MetricCard
        className={METRIC_CARD_CLASS_NAME}
        title={t(`${keyIndicatorsTooltipContentItem?.treesRegenerated.title}`)}
        variant="large"
        progress={site.regeneratedTreesCount ?? 0}
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
        className={METRIC_CARD_CLASS_NAME}
        title={t("Survival Rate")}
        variant="large"
        progress={site.survivalRatePlanted ?? 0}
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
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.hectaresRestored.title}`)}
        progress={site.hectaresRestoredPolygonsCount ?? 0}
        goal={site.hectaresToRestoreGoal ?? 0}
        variant={keyIndicatorsTooltipContentItem?.hectaresRestored.type as MetricCardVariant}
        icon={<AreaHectaresIcon />}
        color="secondary.700"
        type="hectaresRestored"
        className={METRIC_CARD_CLASS_NAME}
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
          className={METRIC_CARD_CLASS_NAME + " !h-auto"}
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
