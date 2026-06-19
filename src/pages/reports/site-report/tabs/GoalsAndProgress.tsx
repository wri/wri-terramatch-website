import { useT } from "@transifex/react";
import React, { FC } from "react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbancesTablePD from "@/components/extensive/Tables/DisturbancesTablePD";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { SUMMARY_ANR_ROLLUP_HIDE, SUMMARY_INVASIVE_ROLLUP_HIDE } from "@/constants/summaryRollupVisibility";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import { SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface GoalsAndProgressTabProps {
  siteReport: SiteReportFullDto;
}

const GoalsAndProgressTab: FC<GoalsAndProgressTabProps> = ({ siteReport }) => {
  const t = useT();
  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <ContextCondition frameworksHide={[Framework.HBF]}>
            <PageCard gap={8}>
              <Text variant="text-20-bold">{t("Trees Planted")}</Text>
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.TREE_CIRCLE_PD,
                    label: t("TOTAL TREES PLANTED (on report):"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                    value: siteReport.totalTreesPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={siteReport.uuid}
                  collection="tree-planted"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </PageCard>
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.HBF]}>
            <PageCard gap={8}>
              <Text variant="text-20-bold">{t("Saplings Planted")}</Text>
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.TREE_CIRCLE_PD,
                    label: t("TOTAL saplings PLANTED (on report):"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                    value: siteReport.totalTreesPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={siteReport.uuid}
                  collection="tree-planted"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </PageCard>
          </ContextCondition>
          <ContextCondition frameworksHide={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
            <PageCard gap={8}>
              <Text variant="text-20-bold">{t("Seeds Planted")}</Text>
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.LEAF_CIRCLE_PD,
                    label: t("TOTAL seeds PLANTED (ON REPORT):"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                    value: siteReport?.totalSeedsPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={siteReport.uuid}
                  collection="seeds"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </PageCard>
          </ContextCondition>
          <ContextCondition frameworksHide={[Framework.PPC]}>
            <PageCard gap={8}>
              <Text variant="text-20-bold">{t("Non-Trees Planted")}</Text>
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.NON_TREES_PLANTED_CIRCLE,
                    label: t("Total non-trees planted (on report):"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                    value: siteReport.totalNonTreeSpeciesPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={siteReport.uuid}
                  collection="non-tree"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </PageCard>
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
            <PageCard gap={8}>
              <Text variant="text-20-bold">{t("Tree Replanting")}</Text>
              <GoalProgressCard
                hasProgress={false}
                classNameCard="!pl-0"
                items={[
                  {
                    iconName: IconNames.LEAF_CIRCLE_PD,
                    label: t("Total trees replanted (on report):"),
                    variantLabel: "text-14",
                    classNameLabel: " text-neutral-650 uppercase !w-auto",
                    classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                    value: siteReport.totalTreeReplantingCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={siteReport.uuid}
                  collection="replanting"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </PageCard>
          </ContextCondition>
          <ContextCondition frameworksHide={[Framework.HBF]}>
            <PageCard gap={8}>
              <div>
                <Text variant="text-20-bold">{t("Assisted Natural Regeneration")}</Text>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.REFRESH_CIRCLE_PD,
                      label: t("ESTIMATED NUMBER OF TREES REGENERATING (ON REPORT):"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                      value: siteReport.numTreesRegenerating!
                    }
                  ]}
                  className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                />
                <Text variant="text-14" className="uppercase text-neutral-650">
                  {t("Description of ANR Activities:")}
                </Text>
                <Text variant="text-16" className="mt-2 text-blueCustom-700">
                  {t(siteReport.regenerationDescription ?? "No description")}
                </Text>
              </div>
            </PageCard>
          </ContextCondition>
          <ContextCondition frameworksHide={SUMMARY_ANR_ROLLUP_HIDE}>
            <PageCard gap={8}>
              <div>
                <Text variant="text-20-bold">{t("Trees Regenerating")}</Text>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.REFRESH_CIRCLE_PD,
                      label: t("Total Trees Regenerating (on report):"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                      value: siteReport.totalTreesRegeneratingSpeciesCount ?? 0
                    }
                  ]}
                  className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                />
                <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                  <TreeSpeciesTable
                    entity="siteReports"
                    entityUuid={siteReport.uuid}
                    collection="anr"
                    visibleRows={8}
                    galleryType={"treeSpeciesPD"}
                  />
                </div>
              </div>
            </PageCard>
          </ContextCondition>
          <ContextCondition frameworksHide={SUMMARY_INVASIVE_ROLLUP_HIDE}>
            <PageCard gap={8}>
              <div>
                <Text variant="text-20-bold">{t("Invasive Trees Removed")}</Text>
                <GoalProgressCard
                  hasProgress={false}
                  classNameCard="!pl-0"
                  items={[
                    {
                      iconName: IconNames.REFRESH_CIRCLE_PD,
                      label: t("Total Trees Removed (on report):"),
                      variantLabel: "text-14",
                      classNameLabel: " text-neutral-650 uppercase !w-auto",
                      classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                      value: siteReport.totalInvasiveTreesCount ?? 0
                    }
                  ]}
                  className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                />
                <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                  <TreeSpeciesTable
                    entity="siteReports"
                    entityUuid={siteReport.uuid}
                    collection="invasive"
                    visibleRows={8}
                    galleryType={"treeSpeciesPD"}
                  />
                </div>
              </div>
            </PageCard>
          </ContextCondition>
          <PageCard gap={8}>
            <div>
              <Text variant="text-20-bold">{t("Disturbances")}</Text>
              <DisturbancesTablePD modelName="siteReports" modelUUID={siteReport.uuid} />
            </div>
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
