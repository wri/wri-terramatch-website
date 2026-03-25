import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";

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
  const metricClassName = classNames(
    "flex-1 max-w-[calc((100%/2)-6px)] ws-1100:max-w-[calc((100%/3)-6px)] md:!max-w-[calc((100%/4)-6px)] lg:!max-w-[calc((100%/4)-1rem)] w-[350px]"
  );

  const framework = site?.frameworkKey;

  const keyIndicatorsTooltipContentItem = useMemo(() => {
    return KEY_INDICATORS_TOOLTIP_CONTENT.find(content => content.frameworks.includes(site.frameworkKey!));
  }, [site.frameworkKey]);

  return (
    <Flex flex={1} flexWrap="wrap" className="gap-x-3 gap-y-3 lg:gap-x-8 lg:gap-y-8" justify={"flex-start"}>
      <MetricCard
        title={t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}
        progress={site.treesPlantedCount ?? 0}
        goal={0}
        variant={keyIndicatorsTooltipContentItem?.treesRestored.type as MetricCardVariant}
        icon={<ProjectIcon />}
        color="secondary.600"
        type="treesRestored"
        className={metricClassName}
        classNameTitle="whitespace-nowrap"
        tooltipContent={
          <Box fontSize="14px" lineHeight="20px">
            <b>{t(`${keyIndicatorsTooltipContentItem?.treesRestored.title}`)}</b>
            <br />
            {t(`${keyIndicatorsTooltipContentItem?.treesRestored.content}`)}
          </Box>
        }
      />
      <MetricCard
        className="flex-1"
        title={t("Seeds Planted")}
        variant="large"
        progress={site.seedsPlantedCount ?? 0}
        goal={0}
        icon={<SeedlingsIcon />}
        tooltipContent={t("Seeds Planted")}
        color="secondary.600"
      />
      <MetricCard
        className="flex-1"
        title={t("Trees Regenerating")}
        variant="large"
        progress={site.regeneratedTreesCount ?? 0}
        goal={0}
        icon={<RegenerationIcon />}
        tooltipContent={t("Trees Regenerating")}
        color="secondary.600"
      />
      <MetricCard
        className="flex-1"
        title={t("Survival Rate")}
        variant="large"
        progress={site.survivalRatePlanted ?? 0}
        goal={0}
        icon={<SurvivalRateIcon />}
        tooltipContent={t("Survival Rate")}
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
        className={metricClassName}
        classNameTitle="whitespace-nowrap"
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
          className={metricClassName + " !h-auto"}
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
      </ContextCondition>
    </Flex>
  );
};

export default KeyIndicatorsInsightsTab;
