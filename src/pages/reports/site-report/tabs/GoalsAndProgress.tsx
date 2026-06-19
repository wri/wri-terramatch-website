import { useT } from "@transifex/react";
import { FC } from "react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import Loader from "@/components/generic/Loading/Loader";
import {
  SUMMARY_ANR_ROLLUP_HIDE,
  SUMMARY_INVASIVE_ROLLUP_HIDE,
  SUMMARY_REPLANTING_ROLLUP_HIDE
} from "@/constants/summaryRollupVisibility";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework, isTerrafund as frameworkIsTerrafund } from "@/context/framework.provider";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { TextVariants } from "@/types/common";

import GoalsAndProgressCard from "../components/GoalsAndProgressCard";
import NothingToReportEmptyState from "../components/NothingToReportEmptyState";

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

interface GoalsAndProgressTabProps {
  siteReport: SiteReportFullDto;
  site?: SiteFullDto | null;
}

const GoalsAndProgressTab: FC<GoalsAndProgressTabProps> = ({ siteReport, site }) => {
  const t = useT();
  const frameworkKey = siteReport.frameworkKey ?? site?.frameworkKey;
  const isHBFFramework = frameworkKey === Framework.HBF;
  const isTerrafund = frameworkIsTerrafund(frameworkKey as Framework);

  if (siteReport.nothingToReport) {
    return (
      <PageBody>
        <PageRow>
          <NothingToReportEmptyState />
        </PageRow>
      </PageBody>
    );
  }

  return (
    <PageBody>
      <PageRow>
        <PageCard title={t("Progress & Goals")}>
          <GoalsAndProgressCard siteReport={siteReport} site={site} />
        </PageCard>
      </PageRow>

      <PageRow>
        <PageCard title={t(isHBFFramework ? "Sapling Planting Progress" : "Tree Planting Progress")}>
          <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
            <div className="flex flex-col gap-4">
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.TREE_CIRCLE_PD,
                    label: t(isHBFFramework ? "number of SAPLINGS PLANTED:" : "number of TREES PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  },
                  ...(frameworkKey !== Framework.HBF
                    ? [
                        {
                          iconName: IconNames.SURVIVAL_RATE,
                          label: t(isTerrafund ? "Last Reported Survival Rate:" : "Estimated Survival Rate:"),
                          variantLabel: "text-14" as TextVariants,
                          classNameLabel: " text-neutral-650 uppercase !w-auto",
                          classNameLabelValue: "!justify-start ml-2 !text-2xl",
                          value: "-"
                        }
                      ]
                    : []),
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species PLANTED:"),
                    variantLabel: "text-14" as TextVariants,
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                    value: "-"
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
                <Loader className="min-h-[200px] w-full" />
              </div>
            </div>
            <div>
              <TreeSpeciesTable
                entity="siteReports"
                entityUuid={siteReport.uuid}
                visibleRows={8}
                collection="tree-planted"
                galleryType="treeSpeciesPD"
              />
            </div>
          </div>
        </PageCard>
      </PageRow>

      <PageRow>
        <PageCard title={t(isTerrafund ? "Non-Tree Planting Progress" : "Seed Planting Progress")}>
          <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
            <div className="flex flex-col gap-4">
              <GoalProgressCard
                frameworksShow={[Framework.PPC]}
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.LEAF_CIRCLE_PD,
                    label: t("number of seeds PLANTED:"),
                    variantLabel: "text-14" as TextVariants,
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  },
                  {
                    iconName: IconNames.SURVIVAL_RATE,
                    label: t("Estimated Survival Rate:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  },
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  }
                ]}
              />
              <GoalProgressCard
                frameworksShow={ALL_TF}
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.NON_TREES_PLANTED_CIRCLE,
                    label: t("number of Non-Trees PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  },
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  }
                ]}
              />
              <GoalProgressCard
                frameworksShow={[Framework.HBF]}
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.LEAF_CIRCLE_PD,
                    label: t("number of seeds PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  },
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  }
                ]}
              />
            </div>
            <div>
              <TreeSpeciesTable
                frameworksShow={ALL_TF}
                entity="siteReports"
                entityUuid={siteReport.uuid}
                collection="non-tree"
                visibleRows={5}
              />
              <TreeSpeciesTable
                frameworksHide={ALL_TF}
                entity="siteReports"
                entityUuid={siteReport.uuid}
                collection="seeds"
                visibleRows={5}
              />
            </div>
          </div>
        </PageCard>
      </PageRow>

      <PageRow frameworksShow={[Framework.HBF]}>
        <PageCard title={t("Non-Tree Planting Progress")}>
          <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
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
                    value: "-"
                  },
                  {
                    iconName: IconNames.LEAF_PLANTED_CIRCLE,
                    label: t("number of species PLANTED:"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl",
                    value: "-"
                  }
                ]}
              />
            </div>
            <div>
              <TreeSpeciesTable
                entity="siteReports"
                entityUuid={siteReport.uuid}
                collection="non-tree"
                visibleRows={5}
              />
            </div>
          </div>
        </PageCard>
      </PageRow>

      <ContextCondition frameworksHide={SUMMARY_ANR_ROLLUP_HIDE}>
        <PageRow>
          <PageCard title={t("Assisted Natural Regeneration Progress")}>
            <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
              <div className="flex flex-col gap-4">
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.REFRESH_CIRCLE_PD,
                      label: t("Trees Regenerating:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: "-"
                    }
                  ]}
                />
              </div>
              <div>
                <TreeSpeciesTable entity="siteReports" entityUuid={siteReport.uuid} collection="anr" visibleRows={5} />
              </div>
            </div>
          </PageCard>
        </PageRow>
      </ContextCondition>

      <ContextCondition frameworksHide={SUMMARY_REPLANTING_ROLLUP_HIDE}>
        <PageRow>
          <PageCard title={t("Trees Replanting Progress")}>
            <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
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
                      value: "-"
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species REPLANTED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: "-"
                    }
                  ]}
                />
              </div>
              <div>
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={siteReport.uuid}
                  collection="replanting"
                  visibleRows={5}
                />
              </div>
            </div>
          </PageCard>
        </PageRow>
      </ContextCondition>

      <ContextCondition frameworksHide={SUMMARY_INVASIVE_ROLLUP_HIDE}>
        <PageRow>
          <PageCard title={t("Invasive Tree Removal Progress")}>
            <div className="grid grid-cols-2 gap-16 mobile:!grid-cols-1">
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
                      value: "-"
                    },
                    {
                      iconName: IconNames.LEAF_PLANTED_CIRCLE,
                      label: t("number of species REMOVED:"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl",
                      value: "-"
                    }
                  ]}
                />
              </div>
              <div>
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={siteReport.uuid}
                  collection="invasive"
                  visibleRows={5}
                />
              </div>
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
