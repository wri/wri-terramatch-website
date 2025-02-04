import { useT } from "@transifex/react";
import { useState } from "react";

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
import { Framework } from "@/context/framework.provider";
import { useGetV2EntityUUIDAggregateReports } from "@/generated/apiComponents";
import GoalsAndProgressEntityTab from "@/pages/site/[uuid]/components/GoalsAndProgressEntityTab";
import { getNewRestorationGoalDataForChart } from "@/utils/dashboardUtils";

interface GoalsAndProgressProps {
  project: any;
}

export const LABEL_LEGEND = [
  {
    label: { key: "Trees", render: "Trees" },
    color: "bg-primary"
  },
  {
    label: { key: "Seeds", render: "Seeds" },
    color: "bg-blueCustom-900"
  },
  {
    label: { key: "Regenerating", render: "Regenerating" },
    color: "bg-secondary-600"
  }
];

export const dataTreeCount = [
  {
    name: ["Species scientific name", "tree"],
    treeCount: "45,000"
  },
  {
    name: ["Species scientific name", "Native species"],
    treeCount: "45,000"
  },
  {
    name: ["Species scientific name", "tree"],
    treeCount: "10,350"
  },
  {
    name: ["Species scientific name", "tree"],
    treeCount: "7,500"
  },
  {
    name: ["Non-scientific name", "non-scientific"],
    treeCount: "4,040"
  },
  {
    name: ["Species scientific name", "tree"],
    treeCount: "3,200"
  },
  {
    name: ["Species scientific name", "new"],
    treeCount: "3,000"
  },
  {
    name: ["Species scientific name", "tree"],
    treeCount: "0"
  }
];

export const dataSeedCount = [
  {
    name: ["Species scientific name", "tree"],
    seedCount: "45,000"
  },
  {
    name: ["Species scientific name", "Native species"],
    seedCount: "45,000"
  },
  {
    name: ["Species scientific name", "tree"],
    seedCount: "10,350"
  },
  {
    name: ["Species scientific name", "tree"],
    seedCount: "7,500"
  }
];
export const dataNonTreeCount = [
  {
    name: ["Species scientific name", "tree"],
    nonTreeCount: "45,000"
  },
  {
    name: ["Species scientific name", "Native species"],
    nonTreeCount: "45,000"
  },
  {
    name: ["Species scientific name", "tree"],
    nonTreeCount: "10,350"
  },
  {
    name: ["Species scientific name", "tree"],
    nonTreeCount: "7,500"
  }
];

export const dataTreeCountSite = [
  {
    name: "Site Name",
    treeCount: "2,500"
  },
  {
    name: "Site Name",
    treeCount: "1,850"
  },
  {
    name: "Site Name",
    treeCount: "1,000"
  },
  {
    name: "Site Name",
    treeCount: "960"
  },
  {
    name: "Site Name",
    treeCount: "620"
  },
  {
    name: "Site Name",
    treeCount: "450"
  },
  {
    name: "Site Name",
    treeCount: "300"
  }
];

export const dataTreeCountGoal = [
  {
    name: ["Species scientific name", "tree"],
    treeCountGoal: ["45,0000", "90,000"]
  },
  {
    name: ["Species scientific name", "Native species"],
    treeCountGoal: ["35,350", "70,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    treeCountGoal: ["10,350", "35,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    treeCountGoal: ["7,500", "21,000"]
  },
  {
    name: ["Non-scientific name", "tree"],
    treeCountGoal: ["4,040", "15,300"]
  },
  {
    name: ["Species scientific name", "tree"],
    treeCountGoal: ["3,200", "8,000"]
  },
  {
    name: ["Species scientific name", "new"],
    treeCountGoal: ["3,000", "5,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    treeCountGoal: ["1,000", "4,500"]
  },
  {
    name: ["Species scientific name", "tree"],
    treeCountGoal: ["0", "3,000"]
  }
];

export const dataSpeciesCountGoal = [
  {
    name: ["Species scientific name", "tree"],
    speciesCountGoal: ["45,0000", "90,000"]
  },
  {
    name: ["Species scientific name", "Native species"],
    speciesCountGoal: ["35,350", "70,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    speciesCountGoal: ["10,350", "35,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    speciesCountGoal: ["7,500", "21,000"]
  },
  {
    name: ["Non-scientific name", "tree"],
    speciesCountGoal: ["4,040", "15,300"]
  },
  {
    name: ["Species scientific name", "tree"],
    speciesCountGoal: ["3,200", "8,000"]
  },
  {
    name: ["Species scientific name", "new"],
    speciesCountGoal: ["3,000", "5,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    speciesCountGoal: ["1,000", "4,500"]
  },
  {
    name: ["Species scientific name", "tree"],
    speciesCountGoal: ["0", "3,000"]
  }
];

export const dataSeedCountGoal = [
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["45,0000", "90,000"]
  },
  {
    name: ["Species scientific name", "Native species"],
    seedCountGoal: ["35,350", "70,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["10,350", "35,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["7,500", "21,000"]
  },
  {
    name: ["Non-scientific name", "tree"],
    seedCountGoal: ["4,040", "15,300"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["3,200", "8,000"]
  },
  {
    name: ["Species scientific name", "new"],
    seedCountGoal: ["3,000", "5,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["1,000", "4,500"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["0", "3,000"]
  }
];

export const dataSeedCountGoalSiteReport = [
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["45,0000", "90,000"]
  },
  {
    name: ["Species scientific name", "Native species", "approved"],
    seedCountGoal: ["35,350", "70,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["10,350", "35,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["7,500", "21,000"]
  },
  {
    name: ["Non-scientific name", "tree", "approved"],
    seedCountGoal: ["4,040", "15,300"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["3,200", "8,000"]
  },
  {
    name: ["Species scientific name", "new"],
    seedCountGoal: ["3,000", "5,000"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["1,000", "4,500"]
  },
  {
    name: ["Species scientific name", "tree"],
    seedCountGoal: ["0", "3,000"]
  }
];

const getProgressData = (totalValue: number, progressValue: number) => {
  return [
    { name: "Total", value: totalValue, color: "#13487A" },
    { name: "Progress", value: progressValue, color: "#7BBD31" }
  ];
};

const isFrameworkTFOrRelated = (frameworkKey: string) => {
  return (
    frameworkKey === Framework.TF || frameworkKey === Framework.TF_LANDSCAPES || frameworkKey === Framework.ENTERPRISES
  );
};

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
  return (
    <PageBody className="text-darkCustom">
      <PageRow>
        <PageCard title={t("Project Progress & Goals")}>
          <GoalsAndProgressEntityTab entity={project} project />
        </PageCard>
      </PageRow>

      <PageRow>
        <PageCard title={t("Tree Planting Progress")}>
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
                      value: project.trees_planted_count
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: `${project.survival_rate}%`
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
                    {t(
                      isFrameworkTFOrRelated(project.framework_key)
                        ? "Number of Trees Planted:"
                        : "Number of SAPLINGS Planted:"
                    )}
                  </Text>
                  <div className="mb-2 flex items-center">
                    <div className="relative h-9 w-[230px]">
                      <div className="absolute inset-0 z-0 h-full w-full">
                        <ProgressBarChart
                          data={getProgressData(project.trees_grown_goal ?? 0, project.trees_planted_count ?? 0)}
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
                      {project.trees_planted_count.toLocaleString()}
                      <Text variant="text-16-light" className="ml-1 text-darkCustom">
                        of {project.trees_grown_goal.toLocaleString()}
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
                framework={project.framework_key}
                visibleRows={8}
                collection="tree-planted"
                galleryType={"treeSpeciesPD"}
                setTotalSpecies={setTreePlantedSpeciesCount}
                setTotalSpeciesGoal={setTreePlantedSpeciesGoal}
              />
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
              <TreeSpeciesTablePD
                modelName="project"
                modelUUID={project.uuid}
                framework={project.framework_key}
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
                framework={project.framework_key}
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
            title={t(
              isFrameworkTFOrRelated(project.framework_key) ? "Non-Tree Planting Progress" : "Seed Planting Progress"
            )}
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
                      value: project.seeds_planted_count
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: `${project.survival_rate}%`
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
              <ContextCondition frameworksShow={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
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
                      <div className="absolute inset-0 z-0 h-full w-full">
                        <ProgressBarChart
                          data={getProgressData(project.seeds_grown_goal ?? 0, project.seeds_planted_count ?? 0)}
                          className="h-full w-full"
                        />
                      </div>
                      <img
                        src="/images/seedBackground.svg"
                        id="seedBackground"
                        alt="secondValue"
                        className="z-1 absolute right-0 h-9 w-[261px]"
                      />
                    </div>
                    <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                      {project.seeds_planted_count.toLocaleString()}
                      <Text variant="text-16-light" className="ml-1 text-darkCustom">
                        of {project.seeds_grown_goal ? project.seeds_grown_goal.toLocaleString() : "0"}
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
                        classNameLabelValue: "!justify-start ml-2 !text-2xl",
                        value: treeCount
                      }
                    ]}
                  />
                </>
              </ContextCondition>
              <div className="mt-2">
                <ContextCondition frameworksShow={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
                  <TreeSpeciesTablePD
                    modelName="project"
                    modelUUID={project.uuid}
                    collection="non-tree"
                    visibleRows={5}
                    setTotalCount={setTreeCount}
                    setTotalSpecies={setSpeciesCount}
                  />
                </ContextCondition>
                <ContextCondition frameworksHide={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
                  <TreeSpeciesTablePD
                    modelName="project"
                    modelUUID={project.uuid}
                    framework={project.framework_key}
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
          <PageCard title={t("Assisted Natural Regeneration Progress")}>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <div>
                <Text variant="text-14" className="mb-2 uppercase text-neutral-650">
                  {t("Estimated Number of trees regenerating")}
                </Text>
                <div className="mb-2 flex items-center">
                  <div className="relative h-9 w-[218px]">
                    <div className="absolute inset-0 z-0 h-full w-full">
                      <ProgressBarChart
                        data={getProgressData(
                          project.goal_trees_restored_anr ?? 0,
                          project.regenerated_trees_count ?? 0
                        )}
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
                    {project.regenerated_trees_count.toLocaleString()}
                    <Text variant="text-16-light" className="ml-1 text-darkCustom">
                      of {project.goal_trees_restored_anr?.toLocaleString()}
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
                    value: project.regenerated_trees_count.toLocaleString()
                  }
                ]}
              />
            </ContextCondition>

            <div className="mt-2">
              <TreeSpeciesTablePD
                modelName="project"
                data={project.assisted_natural_regeneration_list.sort((a: any, b: any) => b.treeCount - a.treeCount)}
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
                        data={getProgressData(
                          project.goal_trees_restored_anr ?? 0,
                          project.regenerated_trees_count ?? 0
                        )}
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
                setTotalNonTree={setTotalNonTreeSpecies}
                setTotalCount={setNonTreeCount}
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
