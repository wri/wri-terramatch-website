import { useT } from "@transifex/react";
import { orderBy } from "lodash";
import { useCallback, useMemo, useState } from "react";

import ProgressBarChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressBarChart";
import TreePlantingChart from "@/admin/components/ResourceTabs/MonitoredTab/components/TreePlantingChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTablePD from "@/components/extensive/Tables/TreeSpeciesTablePD";
import Loader from "@/components/generic/Loading/Loader";
import { TEXT_TYPES } from "@/constants/dashboardConsts";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { useGetV2EntityUUIDAggregateReports } from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import GoalsAndProgressEntityTab from "@/pages/site/[uuid]/components/GoalsAndProgressEntityTab";
import { getNewRestorationGoalDataForChart } from "@/utils/dashboardUtils";

interface GoalsAndProgressProps {
  project: ProjectFullDto;
}

interface NaturalRegenerationItem {
  name: string;
  treeCount: number;
}

const isEmptyArray = (obj: any) => {
  return Object.keys(obj).every(key => Array.isArray(obj[key]) && obj[key].length === 0);
};

const GoalsAndProgressTab = ({ project }: GoalsAndProgressProps) => {
  const t = useT();
  const [treeCount, setTreeCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [nonTreeCount, setNonTreeCount] = useState(0);
  const [totalNonTreeSpecies, setTotalNonTreeSpecies] = useState(0);
  const [treePlantedSpeciesCount, setTreePlantedSpeciesCount] = useState(0);
  const [treePlantedSpeciesGoal, setTreePlantedSpeciesGoal] = useState(0);

  const { data: dataAggregated } = useGetV2EntityUUIDAggregateReports({
    pathParams: {
      uuid: project.uuid,
      entity: "project"
    }
  });

  const formatNaturalGenerationData = orderBy(project.assistedNaturalRegenerationList, ["treeCount"], ["desc"]).map(
    (item: NaturalRegenerationItem) => {
      return {
        name: item.name,
        treeCount: item.treeCount.toLocaleString()
      };
    }
  );

  const LABEL_LEGEND = useMemo(
    () => [
      {
        label: { key: "Trees", render: t("Trees") },
        color: "bg-primary"
      },
      {
        label: { key: "Seeds", render: t("Seeds") },
        color: "bg-blueCustom-900"
      },
      {
        label: { key: "Regenerating", render: t("Regenerating") },
        color: "bg-secondary-600"
      }
    ],
    [t]
  );

  const getProgressData = useCallback(
    (totalValue: number, progressValue: number) => {
      return [
        { name: t("Total"), value: totalValue, color: "#13487A" },
        { name: t("Progress"), value: progressValue, color: "#7BBD31" }
      ];
    },
    [t]
  );

  const isTerrafund = ALL_TF.includes(project.frameworkKey as (typeof ALL_TF)[number]);
  return (
    <PageBody className="text-darkCustom">
      <PageRow>
        <PageCard title={t("Project Progress & Goals")}>
          <GoalsAndProgressEntityTab entity={project} project />
        </PageCard>
      </PageRow>

      <PageRow>
        <PageCard
          title={t(project.frameworkKey == Framework.HBF ? "Sapling Planting Progress" : "Tree Planting Progress")}
        >
          <div className="grid grid-cols-2 gap-16">
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
                      value: project.treesPlantedCount
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: project.survivalRate ? `${project.survivalRate}%` : "N/A"
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
                  <div className="mb-2 flex items-center">
                    <div className="relative h-9 w-[230px]">
                      <div className="absolute inset-0 z-0 h-full w-full">
                        <ProgressBarChart
                          data={getProgressData(project.treesGrownGoal ?? 0, project.treesPlantedCount ?? 0)}
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
                      {project.treesPlantedCount.toLocaleString()}
                      <Text variant="text-16-light" className="ml-1 text-darkCustom">
                        of {(project.treesGrownGoal ?? 0).toLocaleString()}
                      </Text>
                    </Text>
                  </div>
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
                        value: treePlantedSpeciesCount,
                        limit: treePlantedSpeciesGoal
                      }
                    ]}
                  />
                </>
              </ContextCondition>
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
                {dataAggregated ? (
                  <BlurContainer
                    className="min-w-[196px] lg:min-w-[216px] wide:min-w-[236px]"
                    isBlur={isEmptyArray(dataAggregated)}
                    textType={TEXT_TYPES.NO_GRAPH}
                  >
                    <TreePlantingChart data={getNewRestorationGoalDataForChart(dataAggregated)} />
                  </BlurContainer>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <TreeSpeciesTablePD
                modelUUID={project.uuid}
                modelName="project"
                visibleRows={8}
                collection="tree-planted"
                galleryType={"treeSpeciesPD"}
                setTotalSpecies={setTreePlantedSpeciesCount}
                setTotalSpeciesGoal={setTreePlantedSpeciesGoal}
              />
            </ContextCondition>
            <ContextCondition frameworksShow={ALL_TF}>
              <TreeSpeciesTablePD
                modelName="project"
                modelUUID={project.uuid}
                visibleRows={8}
                collection="tree-planted"
                galleryType={"treeSpeciesPD"}
                setTotalSpecies={setTreePlantedSpeciesCount}
                setTotalSpeciesGoal={setTreePlantedSpeciesGoal}
              />
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <TreeSpeciesTablePD
                modelName="project"
                modelUUID={project.uuid}
                visibleRows={8}
                collection="tree-planted"
                galleryType={"treeSpeciesPD"}
                setTotalSpecies={setTreePlantedSpeciesCount}
                setTotalSpeciesGoal={setTreePlantedSpeciesGoal}
              />
            </ContextCondition>
          </div>
        </PageCard>
      </PageRow>
      <PageRow>
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
                      value: project.seedsPlantedCount
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: project.directSeedingSurvivalRate != null ? `${project.directSeedingSurvivalRate}%` : "N/A"
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
                      value: treeCount
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
                  <div className="mb-2 flex items-center">
                    <div className="relative h-9 w-[260px]">
                      <img
                        src="/images/seedBackground.svg"
                        id="seedBackground"
                        alt="secondValue"
                        className="z-1 absolute right-0 h-9 w-[261px]"
                      />
                    </div>
                    <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                      {project.seedsPlantedCount.toLocaleString()}
                    </Text>
                  </div>
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
                        value: treeCount
                      }
                    ]}
                  />
                </>
              </ContextCondition>
              <div className="mt-2">
                <ContextCondition frameworksShow={ALL_TF}>
                  <TreeSpeciesTablePD
                    modelName="project"
                    modelUUID={project.uuid}
                    collection="non-tree"
                    visibleRows={5}
                    setTotalCount={setTreeCount}
                    setTotalSpecies={setSpeciesCount}
                  />
                </ContextCondition>
                <ContextCondition frameworksHide={ALL_TF}>
                  <TreeSpeciesTablePD
                    modelName="project"
                    modelUUID={project.uuid}
                    visibleRows={5}
                    collection="seeding"
                    setTotalCount={setTreeCount}
                    setTotalSpecies={setSpeciesCount}
                  />
                </ContextCondition>
              </div>
            </div>
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Assisted Natural Regeneration Progress")} className="h-full">
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <div>
                <Text variant="text-14" className="mb-2 uppercase text-neutral-650">
                  {t("Estimated Number of trees regenerating")}
                </Text>
                <div className="mb-2 flex items-center">
                  <div className="relative h-9 w-[218px]">
                    <div className="absolute inset-0 z-0 h-full w-full">
                      <ProgressBarChart
                        data={getProgressData(project.goalTreesRestoredAnr ?? 0, project.regeneratedTreesCount ?? 0)}
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
                    {project.regeneratedTreesCount.toLocaleString()}
                    <Text variant="text-16-light" className="ml-1 text-darkCustom">
                      of {project.goalTreesRestoredAnr?.toLocaleString()}
                    </Text>
                  </Text>
                </div>
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
                    value: project.regeneratedTreesCount.toLocaleString()
                  }
                ]}
              />
            </ContextCondition>

            <div className="mt-2">
              <TreeSpeciesTablePD
                modelName="project"
                data={formatNaturalGenerationData}
                modelUUID={project.uuid}
                visibleRows={5}
                typeTable="treeCountSite"
              />
            </div>
          </PageCard>
        </PageColumn>
      </PageRow>
      <ContextCondition frameworksShow={[Framework.HBF]}>
        <PageRow>
          <PageCard title={t("Non-Tree Planting Progress")}>
            <div className="grid grid-cols-2 gap-16">
              <div className="flex flex-col gap-4">
                <Text variant="text-14" className="uppercase text-neutral-650">
                  {t("number of Non-Trees PLANTED:")}
                </Text>
                <div className="mb-2 flex items-center">
                  <div className="relative h-6 w-[212px]">
                    <div className="absolute inset-0 z-0 h-full w-full">
                      <ProgressBarChart
                        data={getProgressData(project.goalTreesRestoredAnr ?? 0, project.regeneratedTreesCount ?? 0)}
                        className="h-full w-full"
                      />
                    </div>
                    <img
                      src="/images/nonTreeBackground.svg"
                      id="nonTreeBackground"
                      alt="secondValue"
                      className="z-1 absolute right-0 h-6 w-[213px]"
                    />
                  </div>
                  <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                    {nonTreeCount.toLocaleString()}
                  </Text>
                </div>
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
              <TreeSpeciesTablePD
                modelName="project"
                collection="non-tree"
                modelUUID={project.uuid}
                visibleRows={5}
                setTotalCount={setNonTreeCount}
                setTotalNonTreeSpecies={setTotalNonTreeSpecies}
              />
            </div>
          </PageCard>
        </PageRow>
      </ContextCondition>

      <br />
      <br />
    </PageBody>
  );
};
export default GoalsAndProgressTab;
