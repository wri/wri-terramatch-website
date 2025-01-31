import { useT } from "@transifex/react";
import React from "react";
import { Else, If, Then, When } from "react-if";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTablePD from "@/components/extensive/Tables/TreeSpeciesTablePD";
import { Framework } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

import GoalsAndProgressEntityTab from "../components/GoalsAndProgressEntityTab";

interface GoalsAndProgressTabProps {
  site: any;
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

const GoalsAndProgressTab = ({ site }: GoalsAndProgressTabProps) => {
  const t = useT();
  console.log("site", site);

  const dataSeedCount = [
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
  const dataNonTreeCount = [
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

  return (
    <PageBody>
      <PageRow>
        <PageCard title={t("Progress & Goals")}>
          <GoalsAndProgressEntityTab entity={site} />
        </PageCard>
      </PageRow>

      <PageRow>
        <PageCard
          title={t(site.framework_key === Framework.HBF ? "Sapling Planting Progress" : "Tree Planting Progress")}
        >
          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.TREE_CIRCLE_PD,
                    label: t(
                      site.framework_key === Framework.HBF ? "number of SAPLINGS PLANTED:" : "number of TREES PLANTED:"
                    ),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: site.trees_planted_count
                  },
                  ...(site.framework_key !== Framework.HBF
                    ? [
                        {
                          iconName: IconNames.SURVIVAL_RATE,
                          label: t(
                            site.framework_key === Framework.TF
                              ? "Last Reported Survival Rate:"
                              : "Estimated Survival Rate:"
                          ),
                          variantLabel: "text-14" as TextVariants,
                          classNameLabel: " text-neutral-650 uppercase !w-auto",
                          classNameLabelValue: "!justify-start ml-2 !text-2xl",
                          value: site.survival_rate_planted ? `${site.survival_rate_planted}%` : "-"
                        }
                      ]
                    : []),
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species PLANTED:"),
                    variantLabel: "text-14" as TextVariants,
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                    value: 10,
                    limit: 12
                  }
                ]}
              />
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
            <div>
              <TreeSpeciesTablePD
                modelName="site"
                modelUUID={site.uuid}
                framework={site.framework_key}
                visibleRows={8}
                collection="tree-planted"
                galleryType={"treeSpeciesPD"}
              />
            </div>
          </div>
        </PageCard>
      </PageRow>
      <PageRow>
        <PageCard
          title={t(site.framework_key === Framework.TF ? "Non-Tree Planting Progress" : "Seed Planting Progress")}
        >
          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <When condition={site.framework_key === Framework.PPC}>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.LEAF_CIRCLE_PD,
                      label: t("number of seeds PLANTED:"),
                      variantLabel: "text-14" as TextVariants,
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
              </When>
              <When condition={site.framework_key === Framework.TF}>
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
              </When>
              <When condition={site.framework_key === Framework.HBF}>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.LEAF_CIRCLE_PD,
                      label: t("number of seeds PLANTED:"),
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
                      value: 6
                    },
                    {
                      iconName: IconNames.LEARF_NATIVE_CIRCLE_PD,
                      label: t("PERCENTAGE of Native species:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: "1%"
                    }
                  ]}
                />
              </When>
            </div>
            <div>
              <If condition={site.framework_key === Framework.TF}>
                <Then>
                  <TreeSpeciesTablePD
                    modelName="site"
                    data={dataNonTreeCount}
                    typeTable="nonTreeCount"
                    modelUUID={site.uuid}
                    visibleRows={10}
                  />
                </Then>
                <Else>
                  <TreeSpeciesTablePD
                    modelName="site"
                    data={dataSeedCount}
                    typeTable="seedCount"
                    modelUUID={site.uuid}
                    visibleRows={10}
                  />
                </Else>
              </If>
            </div>
          </div>
        </PageCard>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
