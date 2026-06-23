import { useT } from "@transifex/react";
import { useCallback, useMemo } from "react";

import ProgressBarChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressBarChart";
import TreePlantingChart from "@/admin/components/ResourceTabs/MonitoredTab/components/TreePlantingChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { usePlantSpeciesCount, usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { SupportedEntity, usePlants } from "@/connections/EntityAssociation";
import { TEXT_TYPES } from "@/constants/dashboardConsts";
import {
  SUMMARY_ANR_ROLLUP_HIDE,
  SUMMARY_INVASIVE_ROLLUP_HIDE,
  SUMMARY_REPLANTING_ROLLUP_HIDE
} from "@/constants/summaryRollupVisibility";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework, isTerrafund as frameworkIsTerrafund } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

import { getReportPeriodRestorationChartData, LABEL_LEGEND } from "./goalsAndProgressReport.utils";

export type ReportEntityName = "projectReports" | "siteReports" | "nurseryReports";

export type GoalsAndProgressReportGoals = {
  treesGrownGoal?: number | null;
  goalTreesRestoredAnr?: number | null;
  directSeedingSurvivalRate?: number | null;
  jobsCreatedGoal?: number | null;
};

export type GoalsAndProgressReportMetrics = {
  treesPlantedCount: number;
  seedsPlantedCount: number;
  regeneratedTreesCount: number;
  pctSurvivalToDate?: number | null;
  regenerationDescription?: string | null;
  seedlingsGrown?: number | null;
  nonTreePlantedCount?: number | null;
  treeReplantingCount?: number | null;
  invasiveTreesCount?: number | null;
};

export type GoalsAndProgressReportSectionsProps = {
  entity: ReportEntityName;
  entityUuid: string;
  frameworkKey: string | null;
  metrics: GoalsAndProgressReportMetrics;
  goals?: GoalsAndProgressReportGoals;
  seedlingOnly?: boolean;
  /** Reporting period anchor for the progress-over-time chart (e.g. dueAt). */
  reportingPeriodDate?: string | null;
};

const GoalsAndProgressReportSections = ({
  entity,
  entityUuid,
  frameworkKey,
  metrics,
  goals,
  seedlingOnly = false,
  reportingPeriodDate
}: GoalsAndProgressReportSectionsProps) => {
  const t = useT();
  const isTerrafund = frameworkIsTerrafund(frameworkKey as Framework);
  const aggregateProps = { entity: entity as SupportedEntity, entityUuid };

  const treeCount = usePlantTotalCount({ ...aggregateProps, collection: isTerrafund ? "non-tree" : "seeds" });
  const { speciesCount } = usePlantSpeciesCount({
    ...aggregateProps,
    collection: isTerrafund ? "non-tree" : "seeds"
  });
  const { speciesCount: treePlantedSpeciesCount, speciesGoal: treePlantedSpeciesGoal } = usePlantSpeciesCount({
    ...aggregateProps,
    collection: "tree-planted"
  });
  const nonTreeCount = usePlantTotalCount({ ...aggregateProps, collection: "non-tree" });
  const { speciesCount: totalNonTreeSpecies } = usePlantSpeciesCount({
    ...aggregateProps,
    collection: "non-tree"
  });
  const totalCountReplanting = usePlantTotalCount({ ...aggregateProps, collection: "replanting" });
  const { speciesCount: totalCountReplantingSpecies } = usePlantSpeciesCount({
    ...aggregateProps,
    collection: "replanting"
  });
  const totalCountInvasive = usePlantTotalCount({ ...aggregateProps, collection: "invasive" });
  const { speciesCount: totalCountInvasiveSpecies } = usePlantSpeciesCount({
    ...aggregateProps,
    collection: "invasive"
  });
  const totalCountNurserySeedling = usePlantTotalCount({ ...aggregateProps, collection: "nursery-seedling" });
  const { speciesCount: nurserySeedlingSpeciesCount } = usePlantSpeciesCount({
    ...aggregateProps,
    collection: "nursery-seedling"
  });
  const [, { data: seedlingPlants }] = usePlants({
    entity: entity as SupportedEntity,
    uuid: entityUuid,
    collection: "nursery-seedling"
  });

  const seedlingsTotal = useMemo(() => {
    if (metrics.seedlingsGrown != null) {
      return metrics.seedlingsGrown;
    }
    return totalCountNurserySeedling;
  }, [metrics.seedlingsGrown, totalCountNurserySeedling]);

  const seedlingsSpeciesCount = useMemo(() => {
    const plantsWithAmount = (seedlingPlants ?? []).filter(plant => (plant.amount ?? 0) > 0);
    if (plantsWithAmount.length > 0) return plantsWithAmount.length;
    return nurserySeedlingSpeciesCount;
  }, [nurserySeedlingSpeciesCount, seedlingPlants]);

  const seedlingGrowthCard = (
    <GoalProgressCard
      hasProgress={false}
      classNameCard="!pl-0"
      items={[
        {
          iconName: IconNames.LEAF_CIRCLE_PD,
          label: t("Number of Seedlings Growing:"),
          variantLabel: "text-14",
          classNameLabel: " text-neutral-650 uppercase !w-auto",
          classNameLabelValue: "!justify-start ml-2 !text-2xl",
          value: seedlingsTotal
        },
        {
          iconName: IconNames.LEAF_PLANTED_CIRCLE,
          label: t("number of species GROWING:"),
          variantLabel: "text-14",
          classNameLabel: " text-neutral-650 uppercase !w-auto",
          classNameLabelValue: "!justify-start ml-2 !text-2xl",
          value: seedlingsSpeciesCount
        }
      ]}
    />
  );
  const getProgressData = useCallback(
    (totalValue: number, progressValue: number) => [
      { name: t("Total"), value: totalValue, color: "#13487A" },
      { name: t("Progress"), value: progressValue, color: "#7BBD31" }
    ],
    [t]
  );

  const { treesPlantedCount, seedsPlantedCount, regeneratedTreesCount, pctSurvivalToDate, regenerationDescription } =
    metrics;
  const treesGrownGoal = goals?.treesGrownGoal ?? 0;
  const goalTreesRestoredAnr = goals?.goalTreesRestoredAnr ?? 0;
  const showSeedlingSection = entity === "projectReports";

  const seedsOrNonTreeCount = isTerrafund
    ? nonTreeCount > 0
      ? nonTreeCount
      : metrics.nonTreePlantedCount ?? 0
    : treeCount > 0
    ? treeCount
    : seedsPlantedCount;

  const effectiveReplantingCount = totalCountReplanting > 0 ? totalCountReplanting : metrics.treeReplantingCount ?? 0;
  const effectiveInvasiveCount = totalCountInvasive > 0 ? totalCountInvasive : metrics.invasiveTreesCount ?? 0;

  const reportPeriodChartData = useMemo(
    () => getReportPeriodRestorationChartData(metrics, reportingPeriodDate),
    [metrics, reportingPeriodDate]
  );
  const hasReportPeriodChart = reportPeriodChartData.length > 0;

  if (seedlingOnly) {
    return (
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageCard title={t("Seedling Growth Progress")}>
          <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
            <div className="flex flex-col gap-4">{seedlingGrowthCard}</div>
            <TreeSpeciesTable
              entity={entity}
              entityUuid={entityUuid}
              collection="nursery-seedling"
              visibleRows={8}
              galleryType="treeSpeciesPD"
            />
          </div>
        </PageCard>
      </PageRow>
    );
  }

  return (
    <>
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageCard title={t(frameworkKey == Framework.HBF ? "Sapling Planting Progress" : "Tree Planting Progress")}>
          <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
            <div className="flex flex-col gap-4">
              <ContextCondition frameworksShow={[Framework.PPC]}>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.TREE_CIRCLE_PD,
                      label: t("Trees Planted:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: treesPlantedCount
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Last Reported Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: pctSurvivalToDate != null ? `${pctSurvivalToDate}%` : "N/A"
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                      value: treePlantedSpeciesCount,
                      limit: treePlantedSpeciesGoal
                    }
                  ]}
                />
              </ContextCondition>
              <ContextCondition frameworksHide={[Framework.PPC]}>
                <>
                  <Text variant="text-14" className="uppercase text-neutral-650">
                    {isTerrafund ? t("Number of Trees Planted:") : t("Number of SAPLINGS Planted:")}
                  </Text>
                  {treesGrownGoal > 0 ? (
                    <div className="mb-2 flex items-center">
                      <div className="relative h-9 w-[230px]">
                        <div className="absolute inset-0 z-0 h-full w-full">
                          <ProgressBarChart
                            data={getProgressData(treesGrownGoal, treesPlantedCount)}
                            className="h-full w-full"
                          />
                        </div>
                        <img
                          src="/images/treeBackgroundShort.svg"
                          id="treeBackgroundShort"
                          alt="secondValue"
                          className="z-1 absolute right-0 h-9 w-[231px]"
                        />
                      </div>
                      <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                        {treesPlantedCount.toLocaleString()}
                        <Text variant="text-16-light" className="ml-1 text-darkCustom">
                          {t("of")} {treesGrownGoal.toLocaleString()}
                        </Text>
                      </Text>
                    </div>
                  ) : (
                    <Text variant="text-24-bold" className="mb-2 text-darkCustom">
                      {treesPlantedCount.toLocaleString()}
                    </Text>
                  )}
                  <GoalProgressCard
                    hasProgress={false}
                    classNameCard="!pl-0"
                    items={[
                      ...(isTerrafund
                        ? [
                            {
                              iconName: IconNames.SURVIVAL_RATE,
                              label: t("Survival Rate:"),
                              variantLabel: "text-14" as TextVariants,
                              classNameLabel: "text-neutral-650 uppercase !w-auto",
                              classNameLabelValue: "!justify-start ml-2 !text-2xl",
                              value: pctSurvivalToDate != null ? `${pctSurvivalToDate}%` : "N/A"
                            }
                          ]
                        : []),
                      {
                        iconName: IconNames.LEAF_PLANTED_CIRCLE,
                        label: t("number of species PLANTED:"),
                        variantLabel: "text-14",
                        classNameLabel: "text-neutral-650 uppercase !w-auto",
                        classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                        value: treePlantedSpeciesCount,
                        limit: treePlantedSpeciesGoal
                      }
                    ]}
                  />
                </>
              </ContextCondition>
              {hasReportPeriodChart && (
                <div className="mt-2 border-t border-dashed border-neutral-480 pt-4">
                  <div className="flex items-center justify-between">
                    <Text variant="text-14" className="uppercase text-neutral-650">
                      {t("PROGRESS over time:")}
                    </Text>
                    <div className="flex items-center gap-4">
                      {LABEL_LEGEND.map((item, index) => (
                        <div key={index} className="flex items-baseline">
                          <span className={`h-[10px] w-[10px] ${item.color} mr-2 rounded-full`} />
                          <Text variant="text-12" className="leading-[normal] text-darkCustom">
                            {t(item.label.key)}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  <BlurContainer
                    className="min-w-[196px] lg:min-w-[216px] wide:min-w-[236px]"
                    isBlur={false}
                    textType={TEXT_TYPES.NO_GRAPH}
                  >
                    <TreePlantingChart data={reportPeriodChartData} />
                  </BlurContainer>
                </div>
              )}
            </div>
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <TreeSpeciesTable
                entity={entity}
                entityUuid={entityUuid}
                visibleRows={8}
                collection="tree-planted"
                galleryType="treeSpeciesPD"
              />
            </ContextCondition>
            <ContextCondition frameworksShow={ALL_TF}>
              <TreeSpeciesTable
                entity={entity}
                entityUuid={entityUuid}
                visibleRows={8}
                collection="tree-planted"
                galleryType="treeSpeciesPD"
              />
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <TreeSpeciesTable
                entity={entity}
                entityUuid={entityUuid}
                visibleRows={8}
                collection="tree-planted"
                galleryType="treeSpeciesPD"
              />
            </ContextCondition>
          </div>
        </PageCard>
      </PageRow>

      {showSeedlingSection && (
        <ContextCondition frameworksShow={[Framework.PPC, ...ALL_TF]}>
          <PageRow className="mx-0 w-full !max-w-full px-6">
            <PageCard title={t("Seedling Growth Progress")}>
              <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
                <div className="flex flex-col gap-4">{seedlingGrowthCard}</div>
                <TreeSpeciesTable
                  entity={entity}
                  entityUuid={entityUuid}
                  collection="nursery-seedling"
                  visibleRows={8}
                  galleryType="treeSpeciesPD"
                />
              </div>
            </PageCard>
          </PageRow>
        </ContextCondition>
      )}

      <PageRow className="mx-0 w-full !max-w-full gap-8 px-6">
        <PageColumn>
          <PageCard
            title={isTerrafund ? t("Non-Tree Planting Progress") : t("Seed Planting Progress")}
            className="h-full"
          >
            <div className="flex flex-col gap-4">
              <ContextCondition frameworksShow={[Framework.PPC]}>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.LEAF_CIRCLE_PD,
                      label: t("Number of Seeds Planted:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: seedsPlantedCount
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: goals?.directSeedingSurvivalRate != null ? `${goals.directSeedingSurvivalRate}%` : "N/A"
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: speciesCount
                    }
                  ]}
                />
              </ContextCondition>
              <ContextCondition frameworksShow={ALL_TF}>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.NON_TREES_PLANTED_CIRCLE,
                      label: t("number of Non-Trees PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: seedsOrNonTreeCount
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: speciesCount
                    }
                  ]}
                />
              </ContextCondition>
              <ContextCondition frameworksShow={[Framework.HBF]}>
                <>
                  <Text variant="text-14" className="uppercase text-neutral-650">
                    {t("Number of seeds Planted:")}
                  </Text>
                  <Text variant="text-24-bold" className="mb-2 text-darkCustom">
                    {seedsPlantedCount.toLocaleString()}
                  </Text>
                  <GoalProgressCard
                    hasProgress={false}
                    classNameCard="!pl-0"
                    items={[
                      {
                        iconName: IconNames.LEAF_PLANTED_CIRCLE,
                        label: t("number of species PLANTED:"),
                        variantLabel: "text-14",
                        classNameLabel: " text-neutral-650 uppercase !w-auto",
                        classNameLabelValue: "!justify-start ml-2 !text-2xl",
                        value: speciesCount
                      }
                    ]}
                  />
                </>
              </ContextCondition>
              <div className="mt-2">
                <ContextCondition frameworksShow={ALL_TF}>
                  <TreeSpeciesTable entity={entity} entityUuid={entityUuid} collection="non-tree" visibleRows={5} />
                </ContextCondition>
                <ContextCondition frameworksHide={ALL_TF}>
                  <TreeSpeciesTable entity={entity} entityUuid={entityUuid} visibleRows={5} collection="seeds" />
                </ContextCondition>
              </div>
            </div>
          </PageCard>
        </PageColumn>

        <PageColumn>
          <ContextCondition frameworksHide={SUMMARY_ANR_ROLLUP_HIDE}>
            <PageCard title={t("Assisted Natural Regeneration Progress")} className="h-full">
              <ContextCondition frameworksShow={[Framework.HBF]}>
                <div>
                  <Text variant="text-14" className="mb-2 uppercase text-neutral-650">
                    {t("Estimated Number of trees regenerating")}
                  </Text>
                  {goalTreesRestoredAnr > 0 ? (
                    <div className="mb-2 flex items-center">
                      <div className="relative h-9 w-[218px]">
                        <div className="absolute inset-0 z-0 h-full w-full">
                          <ProgressBarChart
                            data={getProgressData(goalTreesRestoredAnr, regeneratedTreesCount)}
                            className="h-full w-full"
                          />
                        </div>
                        <img
                          src="/images/regenerationBackground.svg"
                          id="regenerationBackground"
                          alt="secondValue"
                          className="z-1 absolute right-0 h-9 w-[219px]"
                        />
                      </div>
                      <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                        {regeneratedTreesCount.toLocaleString()}
                        <Text variant="text-16-light" className="ml-1 text-darkCustom">
                          {t("of")} {goalTreesRestoredAnr.toLocaleString()}
                        </Text>
                      </Text>
                    </div>
                  ) : (
                    <Text variant="text-24-bold" className="mb-2 text-darkCustom">
                      {regeneratedTreesCount.toLocaleString()}
                    </Text>
                  )}
                </div>
              </ContextCondition>
              <ContextCondition frameworksHide={[Framework.HBF]}>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.REFRESH_CIRCLE_PD,
                      label: t("Estimated Number of trees regenerating:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: regeneratedTreesCount.toLocaleString()
                    }
                  ]}
                />
              </ContextCondition>
              {regenerationDescription != null && regenerationDescription !== "" && (
                <>
                  <Text variant="text-14" className="mt-4 uppercase text-neutral-650">
                    {t("Description of ANR Activities:")}
                  </Text>
                  <Text variant="text-16" className="mt-2 text-blueCustom-700">
                    {regenerationDescription}
                  </Text>
                </>
              )}
              <div className="mt-2">
                <TreeSpeciesTable entity={entity} entityUuid={entityUuid} collection="anr" visibleRows={5} />
              </div>
            </PageCard>
          </ContextCondition>
        </PageColumn>
      </PageRow>

      <ContextCondition frameworksShow={[Framework.HBF]}>
        <PageRow className="mx-0 w-full !max-w-full px-6">
          <PageCard title={t("Non-Tree Planting Progress")}>
            <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
              <div className="flex flex-col gap-4">
                <Text variant="text-14" className="uppercase text-neutral-650">
                  {t("number of Non-Trees PLANTED:")}
                </Text>
                <Text variant="text-24-bold" className="mb-2 text-darkCustom">
                  {nonTreeCount > 0
                    ? nonTreeCount.toLocaleString()
                    : (metrics.nonTreePlantedCount ?? 0).toLocaleString()}
                </Text>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                      value: totalNonTreeSpecies
                    }
                  ]}
                />
              </div>
              <TreeSpeciesTable entity={entity} entityUuid={entityUuid} collection="non-tree" visibleRows={5} />
            </div>
          </PageCard>
        </PageRow>
      </ContextCondition>

      <ContextCondition frameworksHide={SUMMARY_REPLANTING_ROLLUP_HIDE}>
        <PageRow className="mx-0 w-full !max-w-full gap-8 px-6">
          <PageCard title={t("Trees Replanting Progress")}>
            <div className="grid grid-cols-2 gap-16">
              <div className="flex flex-col gap-4">
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.TREE_CIRCLE_PD,
                      label: t("number of trees REPLANTED:"),
                      variantLabel: "text-14" as TextVariants,
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: effectiveReplantingCount
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species REPLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: totalCountReplantingSpecies
                    }
                  ]}
                />
              </div>
              <TreeSpeciesTable entity={entity} entityUuid={entityUuid} collection="replanting" visibleRows={5} />
            </div>
          </PageCard>
        </PageRow>
      </ContextCondition>

      <ContextCondition frameworksHide={SUMMARY_INVASIVE_ROLLUP_HIDE}>
        <PageRow className="mx-0 w-full !max-w-full gap-8 px-6">
          <PageCard title={t("Invasive Tree Removal Progress")}>
            <div className="grid grid-cols-2 gap-16">
              <div className="flex flex-col gap-4">
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.TREE_CIRCLE_PD,
                      label: t("number of trees REMOVED:"),
                      variantLabel: "text-14" as TextVariants,
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: effectiveInvasiveCount
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species REMOVED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: totalCountInvasiveSpecies
                    }
                  ]}
                />
              </div>
              <TreeSpeciesTable entity={entity} entityUuid={entityUuid} collection="invasive" visibleRows={5} />
            </div>
          </PageCard>
        </PageRow>
      </ContextCondition>
    </>
  );
};

export default GoalsAndProgressReportSections;
