import { useT } from "@transifex/react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTablePD from "@/components/extensive/Tables/TreeSpeciesTablePD";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import GoalsAndProgressProjectTab from "@/pages/site/[uuid]/components/GoalsAndProgressProjectTab";

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

const GoalsAndProgressTab = ({ project }: GoalsAndProgressProps) => {
  const t = useT();

  return (
    <PageBody className="text-darkCustom">
      <PageRow>
        <PageCard title={t("Project Progress & Goals")}>
          <GoalsAndProgressProjectTab project={project} />
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
                      value: 100000
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: "85%"
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                      value: 10,
                      limit: 12
                    }
                  ]}
                />
              </ContextCondition>
              <ContextCondition frameworksHide={[Framework.PPC]}>
                <>
                  <Text variant="text-14" className="uppercase text-neutral-650">
                    {t(
                      project.framework_key === Framework.TF
                        ? "Number of Trees Planted:"
                        : "Number of SAPLINGS Planted:"
                    )}
                  </Text>
                  <div className="mb-2 flex items-center">
                    <Icon name={IconNames.TREE_DASHABOARD} className="h-10 w-10 text-primary" />
                    <Icon name={IconNames.TREE_DASHABOARD} className="h-10 w-10 text-primary" />
                    <Icon name={IconNames.TREE_DASHABOARD} className="h-10 w-10 text-primary" />
                    <Icon name={IconNames.TREE_DASHABOARD} className="h-10 w-10 text-primary-200" />
                    <Icon name={IconNames.TREE_DASHABOARD} className="h-10 w-10 text-primary-200" />
                    <Icon name={IconNames.TREE_DASHABOARD} className="h-10 w-10 text-primary-200" />
                    <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                      113,257
                      <Text variant="text-16-light" className="ml-1 text-darkCustom">
                        of 300,000
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
                        value: 10,
                        limit: 12
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
                <img src="/images/graphic-2.png" alt="progress" className="mt-8 w-full" />
              </div>
            </div>
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <TreeSpeciesTablePD
                typeTable="treeCount"
                data={dataTreeCount}
                modelUUID={project.uuid}
                modelName="project"
                visibleRows={10}
              />
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.TF]}>
              <TreeSpeciesTablePD
                modelName="project"
                data={dataTreeCountGoal}
                typeTable="treeCount/Goal"
                modelUUID={project.uuid}
                visibleRows={10}
              />
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <TreeSpeciesTablePD
                modelName="project"
                data={dataSpeciesCountGoal}
                typeTable="speciesCount/Goal"
                modelUUID={project.uuid}
                visibleRows={10}
              />
            </ContextCondition>
          </div>
        </PageCard>
      </PageRow>
      <PageRow>
        <PageColumn>
          <PageCard
            title={t(project.framework_key === Framework.TF ? "Non-Tree Planting Progress" : "Seed Planting Progress")}
          >
            <div className="flex flex-col gap-4">
              <ContextCondition frameworksShow={[Framework.PPC]}>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.LEAF_CIRCLE_PD,
                      label: t("Trees Planted:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: 5250
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: "80% "
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: 6
                    }
                  ]}
                />
              </ContextCondition>
              <ContextCondition frameworksShow={[Framework.TF]}>
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
                      value: 5250
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species PLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: "6"
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
                    <Icon name={IconNames.SEED_PLANTED} className="h-10 w-10 text-primary" />
                    <Icon name={IconNames.SEED_PLANTED} className="h-10 w-10 text-primary" />
                    <Icon name={IconNames.SEED_PLANTED} className="h-10 w-10 text-primary" />
                    <Icon name={IconNames.SEED_PLANTED} className="h-10 w-10 text-primary-200" />
                    <Icon name={IconNames.SEED_PLANTED} className="h-10 w-10 text-primary-200" />
                    <Icon name={IconNames.SEED_PLANTED} className="h-10 w-10 text-primary-200" />
                    <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                      5,250
                      <Text variant="text-16-light" className="ml-1 text-darkCustom">
                        of 25,000
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
                        value: 6
                      }
                    ]}
                  />
                </>
              </ContextCondition>
              <div className="mt-2">
                <ContextCondition frameworksShow={[Framework.TF]}>
                  <TreeSpeciesTablePD
                    modelName="project"
                    modelUUID={project.uuid}
                    data={dataNonTreeCount}
                    visibleRows={10}
                    typeTable="nonTreeCount"
                  />
                </ContextCondition>
                <ContextCondition frameworksHide={[Framework.TF]}>
                  <TreeSpeciesTablePD
                    modelName="project"
                    modelUUID={project.uuid}
                    data={dataSeedCount}
                    visibleRows={10}
                    typeTable="seedCount"
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
                  {t("Estimated  Number of trees regenerating")}
                </Text>
                <div className="mb-2 flex items-center">
                  <Icon name={IconNames.TREES_REGENERATING} className="h-10 w-10 text-primary" />
                  <Icon name={IconNames.TREES_REGENERATING} className="h-10 w-10 text-primary" />
                  <Icon name={IconNames.TREES_REGENERATING} className="h-10 w-10 text-primary" />
                  <Icon name={IconNames.TREES_REGENERATING} className="h-10 w-10 text-primary-200" />
                  <Icon name={IconNames.TREES_REGENERATING} className="h-10 w-10 text-primary-200" />
                  <Icon name={IconNames.TREES_REGENERATING} className="h-10 w-10 text-primary-200" />
                  <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                    5,250
                    <Text variant="text-16-light" className="ml-1 text-darkCustom">
                      of 25,000
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
                    label: t("Estimated  Number of trees regenerating:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: 7000
                  }
                ]}
              />
            </ContextCondition>

            <div className="mt-2">
              <TreeSpeciesTablePD
                modelName="project"
                data={dataTreeCountSite}
                modelUUID={project.uuid}
                visibleRows={10}
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
                  <Icon name={IconNames.NON_TRESS_PLANTED} className="h-10 w-10 text-primary" />
                  <Icon name={IconNames.NON_TRESS_PLANTED} className="h-10 w-10 text-primary" />
                  <Icon name={IconNames.NON_TRESS_PLANTED} className="h-10 w-10 text-primary" />
                  <Icon name={IconNames.NON_TRESS_PLANTED} className="h-10 w-10 text-primary-200" />
                  <Icon name={IconNames.NON_TRESS_PLANTED} className="h-10 w-10 text-primary-200" />
                  <Icon name={IconNames.NON_TRESS_PLANTED} className="h-10 w-10 text-primary-200" />
                  <Text variant="text-24-bold" className="ml-2 flex items-baseline text-darkCustom">
                    8,400
                    <Text variant="text-16-light" className="ml-1 text-darkCustom">
                      of 90,000
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
                      value: 10,
                      limit: 12
                    }
                  ]}
                />
              </div>
              <TreeSpeciesTablePD
                modelName="project"
                modelUUID={project.uuid}
                data={dataNonTreeCount}
                visibleRows={10}
                typeTable="nonTreeCount"
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
