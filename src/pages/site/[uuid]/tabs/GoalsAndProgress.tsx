import { useT } from "@transifex/react";
import React from "react";
import { Else, If, Then, When } from "react-if";

import ProgressGoalsDoughnutChart from "@/admin/components/ResourceTabs/MonitoredTab/components/ProgressGoalsDoughnutChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTablePD from "@/components/extensive/Tables/TreeSpeciesTablePD";
import { Framework } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

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
interface ChartDataItem {
  cardValues: {
    label: string;
    value: number;
    totalName?: string;
    totalValue?: number;
  };
  chartData: any;
  graph?: boolean;
  hectares?: boolean;
}

type ChartsData = {
  terrafund: JSX.Element[];
  ppc: JSX.Element[];
  hbf: JSX.Element[];
};

const CharData = (values: ChartDataItem) => {
  return (
    <GoalProgressCard
      label={values.cardValues.label}
      value={values.cardValues.value}
      totalValue={values.cardValues.totalValue}
      hectares={values.hectares}
      graph={values.graph}
      classNameLabel="text-neutral-650 uppercase mb-3"
      labelVariant="text-14"
      classNameCard="text-center flex flex-col items-center"
      classNameLabelValue="justify-center"
      chart={<ProgressGoalsDoughnutChart key={"items"} data={values.chartData} />}
    />
  );
};

const GoalsAndProgressTab = ({ site }: GoalsAndProgressTabProps) => {
  const t = useT();

  const dataTreeCount = [
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
      name: ["Non-scientific name", "tree"],
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
  const chartDataHectares = {
    chartData: [
      { name: t("HECTARES RESTORED"), value: site.total_hectares_restored_sum },
      site.framework_key !== Framework.PPC
        ? {
            name: t("TOTAL HECTARES RESTORED"),
            value: parseFloat(site.hectares_to_restore_goal)
          }
        : {}
    ],
    cardValues: {
      label: t("HECTARES RESTORED"),
      value: site.total_hectares_restored_sum,
      totalName: t("TOTAL HECTARES RESTORED"),
      totalValue: parseFloat(site.hectares_to_restore_goal)
    }
  };
  const chartDataTreesRestored = {
    chartData: [
      { name: t("TREES RESTORED"), value: site.trees_restored_count },
      site.framework_key == Framework.HBF
        ? {
            name: t("TOTAL TREES RESTORED"),
            value: 0
          }
        : {}
    ],
    cardValues: {
      label: t("TREES RESTORED"),
      value: site.trees_restored_count
    }
  };
  const chartDataWorkdays = {
    chartData: [{ name: t("WORKDAYS CREATED"), value: site.workday_count }],
    cardValues: {
      label: t("WORKDAYS CREATED"),
      value: site.workday_count
    }
  };
  const chartDataSaplings = {
    chartData: [
      { name: t("SAPLINGS RESTORED"), value: site.sapling_species_count }
      // {
      //   name: t("TOTAL SAPLINGS RESTORED"),
      //   value: 200
      // }
    ],
    cardValues: {
      label: t("SAPLINGS RESTORED"),
      value: site.sapling_species_count
      // totalName: t("TOTAL SAPLINGS RESTORED"),
      // totalValue: 200
    }
  };

  const chartsDataMapping: ChartsData = {
    terrafund: [
      <CharData
        key={"terrafund-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
      />,
      <CharData
        key={"terrafund-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={false}
      />
    ],
    ppc: [
      <CharData
        key={"ppc-1"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        graph={false}
        hectares={true}
      />,
      <CharData
        key={"ppc-2"}
        cardValues={chartDataTreesRestored.cardValues}
        chartData={chartDataTreesRestored}
        graph={false}
      />,
      <CharData key={"ppc-3"} cardValues={chartDataWorkdays.cardValues} chartData={chartDataWorkdays} graph={false} />
    ],
    hbf: [
      <CharData key={"hbf-1"} cardValues={chartDataWorkdays.cardValues} chartData={chartDataWorkdays} graph={false} />,
      <CharData
        key={"hbf-2"}
        cardValues={chartDataHectares.cardValues}
        chartData={chartDataHectares}
        hectares={true}
      />,
      <CharData key={"hbf-3"} cardValues={chartDataSaplings.cardValues} chartData={chartDataSaplings} graph={false} />
    ]
  };

  return (
    <PageBody>
      <PageRow>
        <PageCard title={t("Progress & Goals")}>
          <div className="flex w-full flex-wrap items-start justify-between gap-8">
            {chartsDataMapping[site.framework_key as keyof ChartsData].map((chart, index) => (
              <React.Fragment key={index}>{chart}</React.Fragment>
            ))}
            <GoalProgressCard
              label={t("Trees restored")}
              value={site.trees_restored_count}
              limit={site.trees_grown_goal}
              hasProgress={false}
              items={[
                {
                  iconName: IconNames.TREE_CIRCLE_PD,
                  label: t("Trees Planted:"),
                  variantLabel: "text-14",
                  classNameLabel: " text-neutral-650 uppercase",
                  value: site.trees_planted_count
                },
                {
                  iconName: IconNames.LEAF_CIRCLE_PD,
                  label: t("Seeds Planted:"),
                  variantLabel: "text-14",
                  classNameLabel: " text-neutral-650 uppercase",
                  value: site.seeds_planted_count
                },
                {
                  iconName: IconNames.REFRESH_CIRCLE_PD,
                  label: t("Trees Regenerating:"),
                  variantLabel: "text-14",
                  classNameLabel: " text-neutral-650 uppercase",
                  value: site.regenerated_trees_count
                }
              ]}
              className="pr-[41px] lg:pr-[150px]"
            />
          </div>
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
                      site.framework_key === Framework.HBF ? "number of SAPLINGS PLANTED" : "number of TREES PLANTED:"
                    ),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: 100000
                  },
                  ...(site.framework_key !== Framework.HBF
                    ? [
                        {
                          iconName: IconNames.SURVIVAL_RATE,
                          label: t(
                            site.framework_key === Framework.TF
                              ? "Last Reported Survival Rate"
                              : "Estimated Survival Rate:"
                          ),
                          variantLabel: "text-14" as TextVariants,
                          classNameLabel: " text-neutral-650 uppercase !w-auto",
                          classNameLabelValue: "!justify-start ml-2 !text-2xl",
                          value: "85%"
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
                  },
                  ...(site.framework_key === Framework.TF
                    ? [
                        {
                          iconName: IconNames.LEARF_NATIVE_CIRCLE_PD,
                          label: t("PERCENTAGE of Native species:"),
                          variantLabel: "text-14" as TextVariants,
                          classNameLabel: " text-neutral-650 uppercase !w-auto",
                          classNameLabelValue: "!justify-start ml-2 !text-2xl",
                          value: "3% "
                        }
                      ]
                    : [])
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
                data={dataTreeCount}
                typeTable="treeCount"
                modelUUID={site.uuid}
                visibleRows={10}
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
