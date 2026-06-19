import { useT } from "@transifex/react";
import React, { FC } from "react";

import ProgressGoalsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import { GoalProgressCardItemProps } from "@/components/elements/Cards/GoalProgressCard/GoalProgressCardItem";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { SUMMARY_ANR_ROLLUP_HIDE, SUMMARY_REPLANTING_ROLLUP_HIDE } from "@/constants/summaryRollupVisibility";
import { Framework, isTerrafund, toFramework } from "@/context/framework.provider";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { TranslatedText } from "@/i18n/types";
import useTooltipsGoalsAndProgress from "@/pages/site/[uuid]/components/useTooltipsGoalsAndProgress";

interface GoalsAndProgressCardProps {
  siteReport: SiteReportFullDto;
  site?: SiteFullDto | null;
}

interface ProgressDataCardItem {
  cardValues: {
    label: TranslatedText;
    value: number;
    totalName?: TranslatedText;
    totalValue?: number;
  };
  chartData: {
    chartData: { name: string; value: number }[];
  };
  graph?: boolean;
  hectares?: boolean;
  tooltipContent?: TranslatedText;
}

type ChartsData = {
  terrafund: JSX.Element[];
  ppc: JSX.Element[];
  hbf: JSX.Element[];
};

const MOCK_ENTITY = {
  frameworkKey: Framework.PPC,
  totalHectaresRestoredSum: 150,
  hectaresToRestoreGoal: 500,
  treesPlantedCount: 1200,
  seedsPlantedCount: 800,
  regeneratedTreesCount: 200,
  treesGrownGoal: null as number | null,
  workdayCount: 45,
  combinedWorkdayCount: 45,
  totalCountReplanting: 50
};

const ProgressDataCard = (values: ProgressDataCardItem) => {
  return (
    <GoalProgressCard
      label={values.cardValues.label}
      value={values.cardValues.value}
      totalValue={values.cardValues.totalValue}
      hectares={values.hectares}
      graph={values.graph}
      classNameLabel="text-neutral-650 uppercase mb-3 flex items-center gap-2 justify-center"
      labelVariant="text-14"
      classNameCard="text-center flex flex-col items-center"
      classNameLabelValue="justify-center"
      tootipContent={values.tooltipContent ? values.tooltipContent : undefined}
      tooltipTitle={values.tooltipContent ? values.cardValues.label : undefined}
      chart={<ProgressGoalsDoughnutChart key="items" data={values.chartData} />}
    />
  );
};

const GoalsAndProgressCard: FC<GoalsAndProgressCardProps> = ({ siteReport, site }) => {
  const t = useT();
  const tooltips = useTooltipsGoalsAndProgress();

  const entity = {
    frameworkKey: site?.frameworkKey ?? siteReport.frameworkKey ?? MOCK_ENTITY.frameworkKey,
    totalHectaresRestoredSum: site?.totalHectaresRestoredSum ?? MOCK_ENTITY.totalHectaresRestoredSum,
    hectaresToRestoreGoal: site?.hectaresToRestoreGoal ?? MOCK_ENTITY.hectaresToRestoreGoal,
    treesPlantedCount: site?.treesPlantedCount ?? siteReport.totalTreesPlantedCount ?? MOCK_ENTITY.treesPlantedCount,
    seedsPlantedCount: site?.seedsPlantedCount ?? siteReport.totalSeedsPlantedCount ?? MOCK_ENTITY.seedsPlantedCount,
    regeneratedTreesCount:
      site?.regeneratedTreesCount ?? siteReport.numTreesRegenerating ?? MOCK_ENTITY.regeneratedTreesCount,
    treesGrownGoal: MOCK_ENTITY.treesGrownGoal,
    workdayCount: site?.workdayCount ?? MOCK_ENTITY.workdayCount,
    combinedWorkdayCount: site?.combinedWorkdayCount ?? MOCK_ENTITY.combinedWorkdayCount,
    uuid: site?.uuid ?? siteReport.siteUuid ?? siteReport.uuid
  };

  const framework = toFramework(entity.frameworkKey);
  const hideAnrRollup = SUMMARY_ANR_ROLLUP_HIDE.includes(framework);
  const hideReplantingRollup = SUMMARY_REPLANTING_ROLLUP_HIDE.includes(framework);
  const treesFromReportsAnr = hideAnrRollup ? 0 : entity.regeneratedTreesCount ?? 0;
  const totalTreesRestoredCount =
    (entity.treesPlantedCount ?? 0) + (entity.seedsPlantedCount ?? 0) + treesFromReportsAnr;
  const totalCountReplanting = siteReport.totalTreeReplantingCount ?? MOCK_ENTITY.totalCountReplanting;

  const attribMapping = {
    totalHectaresRestoredSum: entity.totalHectaresRestoredSum,
    totalHectaresRestoredGoal: entity.hectaresToRestoreGoal,
    treesRestoredCount: totalTreesRestoredCount,
    treesGrownGoal: entity.treesGrownGoal,
    workdayCount: entity.frameworkKey === Framework.PPC ? entity.combinedWorkdayCount : entity.workdayCount
  };

  const chartDataHectares = {
    chartData: [
      { name: t("HECTARES RESTORED"), value: attribMapping.totalHectaresRestoredSum ?? 0 },
      { name: t("TOTAL HECTARES RESTORED"), value: parseFloat(String(attribMapping.totalHectaresRestoredGoal ?? 0)) }
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: attribMapping.totalHectaresRestoredSum ?? 0,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: parseFloat(String(attribMapping.totalHectaresRestoredGoal ?? 0))
    }
  };

  const chartDataTreesRestored = {
    chartData: [
      { name: t("TREES RESTORED"), value: attribMapping.treesRestoredCount },
      { name: t("TOTAL TREES RESTORED"), value: parseFloat(String(attribMapping.treesGrownGoal ?? 0)) }
    ],
    cardValues: {
      label: t("TREES RESTORED"),
      value: attribMapping.treesRestoredCount,
      totalName: t("TOTAL TREES RESTORED"),
      totalValue: parseFloat(String(attribMapping.treesGrownGoal ?? 0))
    }
  };

  const chartDataWorkdays = {
    chartData: [{ name: t("WORKDAYS CREATED"), value: attribMapping.workdayCount ?? 0 }],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: attribMapping.workdayCount ?? 0
    }
  };

  const chartDataSaplings = {
    chartData: [
      { name: t("SAPLINGS RESTORED"), value: attribMapping.treesRestoredCount },
      { name: t("TOTAL SAPLINGS RESTORED"), value: parseFloat(String(attribMapping.treesGrownGoal ?? 0)) }
    ],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: attribMapping.treesRestoredCount,
      totalName: t("TOTAL SAPLINGS RESTORED"),
      totalValue: parseFloat(String(attribMapping.treesGrownGoal ?? 0))
    }
  };

  const chartsDataMapping: ChartsData = {
    terrafund: [
      <ProgressDataCard
        key="terrafund-1"
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares
        graph
        tooltipContent={tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key="terrafund-2"
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={false}
        tooltipContent={tooltips.TOOLTIP_TREE_RESTORED_SITE}
      />
    ],
    ppc: [
      <ProgressDataCard
        key="ppc-1"
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        graph={false}
        hectares
        tooltipContent={tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key="ppc-2"
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={false}
        tooltipContent={tooltips.TOOLTIP_TREE_RESTORED_SITE}
      />,
      <ProgressDataCard
        key="ppc-3"
        cardValues={chartDataWorkdays.cardValues}
        chartData={chartDataWorkdays}
        graph={false}
      />
    ],
    hbf: [
      <ProgressDataCard
        key="hbf-1"
        cardValues={chartDataWorkdays.cardValues}
        chartData={chartDataWorkdays}
        graph={false}
      />,
      <ProgressDataCard
        key="hbf-2"
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares
        tooltipContent={tooltips.TOOLTIP_HECTARES_RESTORED_SITE}
      />,
      <ProgressDataCard
        key="hbf-3"
        cardValues={chartDataSaplings.cardValues}
        chartData={chartDataSaplings}
        graph={false}
        tooltipContent={tooltips.TOOLTIP_SAPLING_RESTORED_SITE}
      />
    ]
  };

  const frameworkKey = entity.frameworkKey as Framework;
  const chartFramework = isTerrafund(frameworkKey) ? Framework.TF : frameworkKey;

  const treesRestoredItems: GoalProgressCardItemProps[] = [
    {
      iconName: IconNames.TREE_CIRCLE_PD,
      label: t("Trees Planted:"),
      variantLabel: "text-14",
      classNameLabel: " text-neutral-650 uppercase",
      value: entity.treesPlantedCount ?? 0,
      tooltipContent: tooltips.TOOLTIP_TREES_PLANTED_SITE,
      classNameLabelValue: "flex items-center gap-2"
    },
    {
      iconName: IconNames.LEAF_CIRCLE_PD,
      label: t("Seeds Planted:"),
      variantLabel: "text-14",
      classNameLabel: " text-neutral-650 uppercase",
      value: entity.seedsPlantedCount ?? 0,
      tooltipContent: tooltips.TOOLTIP_SEEDS_PLANTED_SITE
    },
    ...(hideAnrRollup
      ? []
      : ([
          {
            iconName: IconNames.REFRESH_CIRCLE_PD,
            label: t("Trees Regenerating:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: treesFromReportsAnr,
            tooltipContent: tooltips.TOOLTIP_TREES_REGENERATING_SITE
          }
        ] as GoalProgressCardItemProps[])),
    ...(hideReplantingRollup
      ? []
      : ([
          {
            iconName: IconNames.TREE_CIRCLE_PD,
            label: t("Trees Replanted:"),
            variantLabel: "text-14",
            classNameLabel: " text-neutral-650 uppercase",
            value: totalCountReplanting,
            tooltipContent: tooltips.TOOLTIP_TREES_REPLANTING_SITE
          }
        ] as GoalProgressCardItemProps[]))
  ];

  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-4">
      {chartsDataMapping[chartFramework as keyof ChartsData]?.map((chart, index) => (
        <React.Fragment key={index}>{chart}</React.Fragment>
      ))}
      <GoalProgressCard
        label={t("Trees restored")}
        value={totalTreesRestoredCount}
        limit={entity.treesGrownGoal ?? undefined}
        hasProgress={false}
        items={treesRestoredItems}
        className="pr-[41px] lg:pr-[150px] mobile:w-[400px] mobile:!pr-0"
      />
    </div>
  );
};

export default GoalsAndProgressCard;
