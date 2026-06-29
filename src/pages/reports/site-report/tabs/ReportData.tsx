import { useT } from "@transifex/react";
import Link from "next/link";
import { FC, Fragment, useMemo } from "react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import ButtonField from "@/components/elements/Field/ButtonField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import EntityGalleryCard from "@/components/extensive/EntityGallery/EntityGalleryCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbancesTablePD from "@/components/extensive/Tables/DisturbancesTablePD";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import useCollectionsTotal, { CollectionsTotalProps } from "@/components/extensive/TrackingCollapseGrid/hooks";
import TrackingDisplay from "@/components/extensive/TrackingCollapseGrid/TrackingDisplay";
import Loader from "@/components/generic/Loading/Loader";
import { SUMMARY_ANR_ROLLUP_HIDE, SUMMARY_INVASIVE_ROLLUP_HIDE } from "@/constants/summaryRollupVisibility";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { MediaDto, SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import NothingToReportEmptyState from "@/pages/reports/site-report/components/NothingToReportEmptyState";

type MediaFieldKey = "treePlantingUpload" | "anrPhotos" | "soilWaterConservationUpload" | "soilWaterConservationPhotos";

const sections: { name: string; property: MediaFieldKey }[] = [
  { name: "Tree Planting Upload", property: "treePlantingUpload" },
  { name: "Soil or Water Conservation Upload", property: "soilWaterConservationUpload" }
];

type SiteReportDataTabProps = {
  report: SiteReportFullDto;
  site?: SiteFullDto | null;
};

const SiteReportDataTab: FC<SiteReportDataTabProps> = ({ report, site }) => {
  const t = useT();
  const { format } = useDate();

  const totalProps: Omit<CollectionsTotalProps, "collections"> = {
    entity: "siteReports",
    uuid: report.uuid,
    domain: "demographics",
    trackingType: "workdays"
  };
  const workdaysTotal = useCollectionsTotal({ ...totalProps, collections: DemographicCollections.WORKDAYS_SITE });
  const workdaysPaid = useCollectionsTotal({
    ...totalProps,
    collections: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("paid-"))
  });
  const workdaysVolunteer = useCollectionsTotal({
    ...totalProps,
    collections: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("volunteer-"))
  });

  const totalFiles = useMemo(
    () => sections.reduce((total, section) => total + (report[section.property]?.length ?? 0), 0),
    [report]
  );

  if (report.nothingToReport) {
    return (
      <PageRow>
        <PageColumn>
          <NothingToReportEmptyState />
        </PageColumn>
      </PageRow>
    );
  }

  return (
    <>
      <PageRow>
        <PageColumn>
          <EntityGalleryCard
            modelName="sites"
            modelUUID={report.siteUuid!}
            galleryEntity="siteReports"
            galleryUuid={report.uuid}
            modelTitle={t("Site Report")}
            entityData={site}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this site report."
            )}
          />
          {report.sharedDriveLink != null ? (
            <Paper>
              <ButtonField
                label={t("Shared Drive link")}
                buttonProps={{
                  as: Link,
                  children: t("View"),
                  href: report.sharedDriveLink ?? "",
                  target: "_blank"
                }}
              />
            </Paper>
          ) : null}
        </PageColumn>
      </PageRow>
      <ContextCondition frameworksShow={[Framework.HBF]}>
        <PageRow>
          <PageCard title={t("Site Report Files")} gap={8}>
            {totalFiles === 0 ? (
              <h3>{t("Files not found")}</h3>
            ) : (
              sections.map((section, index) => (
                <Fragment key={index}>
                  {report[section.property].map((file: MediaDto) => (
                    <Paper key={file.uuid}>
                      <ButtonField
                        key={file.uuid}
                        label={t(section.name)}
                        subtitle={t(file.fileName)}
                        buttonProps={{
                          as: Link,
                          children: t("Download"),
                          href: file.url ?? "",
                          download: true
                        }}
                      />
                    </Paper>
                  ))}
                </Fragment>
              ))
            )}
          </PageCard>
        </PageRow>
      </ContextCondition>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Reported Data")} gap={8}>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <LongTextField title={t("Sites Changes")}>{report.polygonStatus}</LongTextField>
              <LongTextField title={t("ANR Description")}>{report.technicalNarrative}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksHide={[...ALL_TF, Framework.HBF]}>
              <LongTextField title={t("Technical Narrative")}>{report.technicalNarrative}</LongTextField>
              <LongTextField title={t("Public Narrative")}>{report.publicNarrative}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
              <LongTextField title={t("Survival Rate")}>{report.pctSurvivalToDate}</LongTextField>
              <LongTextField title={t("Description of Survival Rate Calculation")}>
                {report.survivalCalculation}
              </LongTextField>
              <LongTextField title={t("Explanation of Survival Rate")}>{report.survivalDescription}</LongTextField>
              <LongTextField title={t("Maintenance Activities")}>{report.maintenanceActivities}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksHide={[Framework.HBF]}>
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
                    value: report.totalTreesPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={report.uuid}
                  collection="tree-planted"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.HBF]}>
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
                    value: report.totalTreesPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={report.uuid}
                  collection="tree-planted"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </ContextCondition>
            <ContextCondition frameworksHide={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
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
                    value: report.totalSeedsPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={report.uuid}
                  collection="seeds"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </ContextCondition>
            <ContextCondition frameworksHide={[Framework.PPC]}>
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
                    value: report.totalNonTreeSpeciesPlantedCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={report.uuid}
                  collection="non-tree"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
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
                    value: report.totalTreeReplantingCount!
                  }
                ]}
                className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
              />
              <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                <TreeSpeciesTable
                  entity="siteReports"
                  entityUuid={report.uuid}
                  collection="replanting"
                  visibleRows={8}
                  galleryType={"treeSpeciesPD"}
                />
              </div>
            </ContextCondition>
            <ContextCondition frameworksHide={[Framework.HBF]}>
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
                      value: report.numTreesRegenerating!
                    }
                  ]}
                  className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                />
                <Text variant="text-14" className="uppercase text-neutral-650">
                  {t("Description of ANR Activities:")}
                </Text>
                <Text variant="text-16" className="mt-2 text-blueCustom-700">
                  {t(report.regenerationDescription ?? "No description")}
                </Text>
              </div>
            </ContextCondition>
            <ContextCondition frameworksHide={SUMMARY_ANR_ROLLUP_HIDE}>
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
                      value: report.totalTreesRegeneratingSpeciesCount ?? 0
                    }
                  ]}
                  className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                />
                <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                  <TreeSpeciesTable
                    entity="siteReports"
                    entityUuid={report.uuid}
                    collection="anr"
                    visibleRows={8}
                    galleryType={"treeSpeciesPD"}
                  />
                </div>
              </div>
            </ContextCondition>
            <ContextCondition frameworksHide={SUMMARY_INVASIVE_ROLLUP_HIDE}>
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
                      value: report.totalInvasiveTreesCount ?? 0
                    }
                  ]}
                  className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                />
                <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                  <TreeSpeciesTable
                    entity="siteReports"
                    entityUuid={report.uuid}
                    collection="invasive"
                    visibleRows={8}
                    galleryType={"treeSpeciesPD"}
                  />
                </div>
              </div>
            </ContextCondition>
            <div>
              <Text variant="text-20-bold">{t("Disturbances")}</Text>
              <DisturbancesTablePD modelName="siteReports" modelUUID={report.uuid} />
            </div>
          </PageCard>
        </PageColumn>
      </PageRow>
      <PageRow frameworksShow={[Framework.HBF]}>
        <PageColumn>
          <PageCard title={t("Invasive Species Management")}>
            <LongTextField title={t("Information invasive species and are restored")}>
              {report.invasiveSpeciesManagement}
            </LongTextField>
            <LongTextField title={t("Post Invasive removal plan")}>{report.invasiveSpeciesRemoved}</LongTextField>
          </PageCard>
        </PageColumn>
      </PageRow>
      <PageRow frameworksShow={[Framework.HBF]}>
        <PageColumn>
          <PageCard title={t("Soil + Water Management")}>
            <LongTextField title={t("Soil and Water-Based Restoration Description")}>
              {report.soilWaterRestorationDescription}
            </LongTextField>
            <LongTextField title={t("Water + Soil Conservation Structures Created")}>
              {report.waterStructures}
            </LongTextField>
          </PageCard>
        </PageColumn>
      </PageRow>
      <PageRow frameworksShow={[Framework.HBF]}>
        <PageColumn>
          <PageCard title={t("Site Socioeconomic Impact")}>
            <LongTextField title={t("Site Community Partners Description")}>
              {report.siteCommunityPartnersDescription}
            </LongTextField>
            <LongTextField title={t("Site Income Generating Activities")}>
              {report.siteCommunityPartnersIncomeIncreaseDescription}
            </LongTextField>
          </PageCard>
        </PageColumn>
      </PageRow>
      <PageRow>
        <PageColumn frameworksShow={[Framework.HBF, Framework.PPC]}>
          <PageCard title={t("Site Report Details")}>
            <TextField label={t("Site Report name")} value={report.title!} />
            <TextField label={t("Site name")} value={report.siteName!} />
            <TextField
              label={t("Created by")}
              value={(report.createdByFirstName ?? "") + " " + (report.createdByLastName ?? "")}
            />
            <TextField label={t("Updated")} value={format(report.updatedAt)} />
            <TextField label={t("Due date")} value={format(report.dueAt)} />
            <TextField label={t("Submitted date")} value={format(report.submittedAt)} />
          </PageCard>
        </PageColumn>
        <PageColumn frameworksShow={[Framework.PPC]}>
          <PageCard title={t("Report Overview")}>
            {workdaysPaid == null || workdaysVolunteer == null ? (
              <Loader className="h-16 w-full" />
            ) : (
              <>
                <TextField label={t("Workdays Paid")} value={String(workdaysPaid)} />
                <TextField label={t("Workdays Volunteer")} value={String(workdaysVolunteer)} />
              </>
            )}
          </PageCard>
          <Paper>
            <ButtonField
              label={t("Socioeconomic Benefits")}
              buttonProps={{
                as: Link,
                children: t("Download"),
                href: report.socioeconomicBenefits?.[0]?.url ?? "",
                download: true
              }}
            />
          </Paper>
        </PageColumn>
      </PageRow>
      <PageRow frameworksShow={[Framework.PPC]}>
        <PageColumn>
          <PageCard>
            {workdaysTotal == null ? (
              <Loader className="h-32 w-full" />
            ) : (
              <>
                <Text variant="text-bold-headline-800">{`Site Reports - ${workdaysTotal}`}</Text>
                {DemographicCollections.WORKDAYS_SITE.map(collection => (
                  <Fragment key={collection}>
                    {collection === DemographicCollections.WORKDAYS_SITE_OTHER && (
                      <TextField
                        label={t("Other Activities Description")}
                        value={report.paidOtherActivityDescription!}
                      />
                    )}
                    <TrackingDisplay
                      entity="siteReports"
                      uuid={report.uuid}
                      domain="demographics"
                      type="workdays"
                      collection={collection}
                    />
                  </Fragment>
                ))}
              </>
            )}
          </PageCard>
        </PageColumn>
      </PageRow>
    </>
  );
};

export default SiteReportDataTab;
