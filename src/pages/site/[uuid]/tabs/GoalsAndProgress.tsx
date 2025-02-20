import { useT } from "@transifex/react";
import React, { useState } from "react";
import { Else, If, Then, When } from "react-if";

import TreePlantingChart from "@/admin/components/ResourceTabs/MonitoredTab/components/TreePlantingChart";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTablePD from "@/components/extensive/Tables/TreeSpeciesTablePD";
import Loader from "@/components/generic/Loading/Loader";
import { TEXT_TYPES } from "@/constants/dashboardConsts";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { useGetV2EntityUUIDAggregateReports } from "@/generated/apiComponents";
import { TextVariants } from "@/types/common";
import { getNewRestorationGoalDataForChart } from "@/utils/dashboardUtils";

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

const isEmptyArray = (obj: any) => {
  return Object.keys(obj).every(key => Array.isArray(obj[key]) && obj[key].length === 0);
};

const GoalsAndProgressTab = ({ site }: GoalsAndProgressTabProps) => {
  const t = useT();
  const [treeCount, setTreeCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [totalNonTree, setTotalNonTree] = useState(0);
  const [totalNonTreeSpecies, setTotalNonTreeSpecies] = useState(0);
  const [treePlantedSpeciesCount, setTreePlantedSpeciesCount] = useState(0);
  const [treePlantedSpeciesGoal, setTreePlantedSpeciesGoal] = useState(0);
  const { data: dataAggregated } = useGetV2EntityUUIDAggregateReports({
    pathParams: {
      uuid: site.uuid,
      entity: "site"
    }
  });
  const isTerrafund = ALL_TF.includes(site.framework_key as Framework);
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
                          label: t(isTerrafund ? "Last Reported Survival Rate:" : "Estimated Survival Rate:"),
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
                    value: treePlantedSpeciesCount,
                    limit: treePlantedSpeciesGoal
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
            <div>
              <TreeSpeciesTablePD
                modelName="site"
                modelUUID={site.uuid}
                visibleRows={8}
                collection="tree-planted"
                galleryType={"treeSpeciesPD"}
                setTotalSpecies={setTreePlantedSpeciesCount}
                setTotalSpeciesGoal={setTreePlantedSpeciesGoal}
              />
            </div>
          </div>
        </PageCard>
      </PageRow>
      <PageRow>
        <PageCard title={t(isTerrafund ? "Non-Tree Planting Progress" : "Seed Planting Progress")}>
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
                      value: site.seeds_planted_count.toLocaleString()
                    },
                    {
                      iconName: IconNames.SURVIVAL_RATE,
                      label: t("Estimated Survival Rate:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: site.direct_seeding_survival_rate ? `${site.direct_seeding_survival_rate}%` : "-"
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
              </When>
              <When condition={isTerrafund}>
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
                      value: treeCount.toLocaleString()
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
                      value: site.seeds_planted_count.toLocaleString()
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
              </When>
            </div>
            <div>
              <If condition={isTerrafund}>
                <Then>
                  <TreeSpeciesTablePD
                    modelName="site"
                    collection="non-tree"
                    modelUUID={site.uuid}
                    visibleRows={5}
                    setTotalSpecies={setSpeciesCount}
                    setTotalCount={setTreeCount}
                  />
                </Then>
                <Else>
                  <TreeSpeciesTablePD
                    modelName="site"
                    collection="seeding"
                    modelUUID={site.uuid}
                    visibleRows={5}
                    setTotalCount={setTreeCount}
                    setTotalSpecies={setSpeciesCount}
                  />
                </Else>
              </If>
            </div>
          </div>
        </PageCard>
      </PageRow>
      <PageRow frameworksShow={[Framework.HBF]}>
        <PageCard title={t("Non-Tree Planting Progress")}>
          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
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
                    value: totalNonTree.toLocaleString()
                  },
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: totalNonTreeSpecies
                  }
                ]}
              />
            </div>
            <div>
              <TreeSpeciesTablePD
                modelName="site"
                collection="non-tree"
                modelUUID={site.uuid}
                visibleRows={5}
                setTotalNonTree={setTotalNonTree}
                setTotalNonTreeSpecies={setTotalNonTreeSpecies}
              />
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
