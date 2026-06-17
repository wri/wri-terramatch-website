import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useSiteReportKeyIndicatorsContent } from "@/pages/reports/site-report/constants/siteReportKeyIndicatorsContent";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import {
  DirectSeedingIcon,
  JobsIcon,
  RegenerationIcon,
  SurvivalRateIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";

interface SiteReportKeyIndicatorsInsightsProps {
  siteReport: SiteReportFullDto;
}

const SiteReportKeyIndicatorsInsights: FC<SiteReportKeyIndicatorsInsightsProps> = ({ siteReport }) => {
  const t = useT();
  const keyIndicatorsContent = useSiteReportKeyIndicatorsContent();

  const contentItem = useMemo(
    () => keyIndicatorsContent.find(content => content.frameworks.includes(siteReport.frameworkKey!)),
    [keyIndicatorsContent, siteReport.frameworkKey]
  );

  const workdaysTotal = useCollectionsTotal({
    entity: "siteReports",
    uuid: siteReport.uuid,
    domain: "demographics",
    trackingType: "workdays",
    collections: DemographicCollections.WORKDAYS_SITE
  });

  const treesRegenerating = siteReport.totalTreesRegeneratingSpeciesCount ?? siteReport.numTreesRegenerating ?? 0;
  const isHBF = siteReport.frameworkKey === Framework.HBF;

  const tooltip = (title: string, body: string) => (
    <Box fontSize="14px" lineHeight="20px">
      <b>{title}</b>
      <br />
      {body}
    </Box>
  );

  return (
    <MetricCardsRow>
      <MetricCard
        title={contentItem?.treesPlanted.title ?? t("Trees Planted")}
        progress={siteReport.totalTreesPlantedCount ?? 0}
        goal={0}
        variant="large"
        icon={<TreeIcon />}
        color="secondary.600"
        className={isHBF ? "flex-[1]" : "flex-[0_0_calc((100%_-_0.75rem)_/_2)] lg:flex-[0_0_calc((100%_-_1.5rem)_/_2)]"}
        tooltipContent={tooltip(
          contentItem?.treesPlanted.title ?? t("Trees Planted"),
          contentItem?.treesPlanted.content ?? ""
        )}
      />
      <ContextCondition frameworksShow={ALL_TF}>
        <MetricCard
          title={contentItem?.survivalRate?.title ?? t("Survival Rate")}
          progress={siteReport.pctSurvivalToDate ?? 0}
          goal={0}
          variant="large"
          icon={<SurvivalRateIcon />}
          color="secondary.600"
          className={"flex-[0_0_calc((100%_-_0.75rem)_/_2)] lg:flex-[0_0_calc((100%_-_1.5rem)_/_2)]"}
          tooltipContent={tooltip(
            contentItem?.survivalRate?.title ?? t("Survival Rate"),
            contentItem?.survivalRate?.content ?? ""
          )}
        />
        <MetricCard
          title={contentItem?.treesRegenerated?.title ?? t("Trees Regenerated")}
          progress={treesRegenerating}
          goal={0}
          variant="large"
          icon={<RegenerationIcon />}
          color="secondary.600"
          className={"flex-[0_0_calc((100%_-_0.75rem)_/_2)] lg:flex-[0_0_calc((100%_-_1.5rem)_/_2)]"}
          tooltipContent={tooltip(
            contentItem?.treesRegenerated?.title ?? t("Trees Regenerated"),
            contentItem?.treesRegenerated?.content ?? ""
          )}
        />
      </ContextCondition>
      <ContextCondition frameworksShow={[Framework.PPC]}>
        <MetricCard
          title={contentItem?.directSeeding?.title ?? t("Direct Seeding")}
          progress={siteReport.totalSeedsPlantedCount ?? 0}
          goal={0}
          variant="large"
          icon={<DirectSeedingIcon />}
          color="secondary.600"
          className={"flex-[0_0_calc((100%_-_0.75rem)_/_2)] lg:flex-[0_0_calc((100%_-_1.5rem)_/_2)]"}
          tooltipContent={tooltip(
            contentItem?.directSeeding?.title ?? t("Direct Seeding"),
            contentItem?.directSeeding?.content ?? ""
          )}
        />
        <MetricCard
          title={contentItem?.treesRegenerating?.title ?? t("Trees Regenerating")}
          progress={treesRegenerating}
          goal={0}
          variant="large"
          icon={<RegenerationIcon />}
          color="secondary.600"
          className={"flex-[0_0_calc((100%_-_0.75rem)_/_2)] lg:flex-[0_0_calc((100%_-_1.5rem)_/_2)]"}
          tooltipContent={tooltip(
            contentItem?.treesRegenerating?.title ?? t("Trees Regenerating"),
            contentItem?.treesRegenerating?.content ?? ""
          )}
        />
        <MetricCard
          title={contentItem?.workdays?.title ?? t("Workdays")}
          progress={workdaysTotal ?? 0}
          goal={0}
          variant="large"
          icon={<JobsIcon />}
          color="secondary.600"
          className={"flex-[0_0_calc((100%_-_0.75rem)_/_2)] lg:flex-[0_0_calc((100%_-_1.5rem)_/_2)]"}
          tooltipContent={tooltip(contentItem?.workdays?.title ?? t("Workdays"), contentItem?.workdays?.content ?? "")}
        />
      </ContextCondition>
    </MetricCardsRow>
  );
};

export default SiteReportKeyIndicatorsInsights;
