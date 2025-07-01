import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { Else, If, Then, When } from "react-if";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ButtonField from "@/components/elements/Field/ButtonField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import DemographicsDisplay from "@/components/extensive/DemographicsCollapseGrid/DemographicsDisplay";
import useCollectionsTotal, { CollectionsTotalProps } from "@/components/extensive/DemographicsCollapseGrid/hooks";
import EntityMapAndGalleryCard from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbancesTablePD from "@/components/extensive/Tables/DisturbancesTablePD";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite, useFullSiteReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import { ContextCondition } from "@/context/ContextCondition";
import FrameworkProvider, { ALL_TF, Framework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import SiteReportHeader from "@/pages/reports/site-report/components/SiteReportHeader";

type MediaFieldKey = "treePlantingUpload" | "anrPhotos" | "soilWaterConservationUpload" | "soilWaterConservationPhotos";

const sections: { name: string; property: MediaFieldKey }[] = [
  { name: "Tree Planting Upload", property: "treePlantingUpload" },
  { name: "Soil or Water Conservation Upload", property: "soilWaterConservationUpload" }
];

const SiteReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const siteReportUUID = router.query.uuid as string;

  const [isLoaded, { data: siteReport }] = useFullSiteReport({ id: siteReportUUID });

  const [, { data: site }] = useFullSite({ id: siteReport?.siteUuid! });
  const [, { data: task }] = useTask({ id: siteReport?.taskUuid ?? undefined });

  const reportTitle = siteReport?.reportTitle ?? siteReport?.title ?? t("Site Report");
  const headerReportTitle = site?.name ? `${site?.name} ${reportTitle}` : "";

  const totalProps: Omit<CollectionsTotalProps, "collections"> = {
    entity: "siteReports",
    uuid: siteReportUUID,
    demographicType: "workdays"
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

  const window = useReportingWindow(task?.dueAt);
  const taskTitle = t("Reporting Task {window}", { window });

  const totalFiles = useMemo(
    () => sections.reduce((total, section) => total + (siteReport?.[section.property]?.length ?? 0), 0),
    [siteReport]
  );

  return (
    <FrameworkProvider frameworkKey={siteReport?.frameworkKey!}>
      <LoadingContainer loading={!isLoaded}>
        <Head>
          <title>{reportTitle}</title>
        </Head>
        <PageBreadcrumbs
          links={[
            { title: t("My Projects"), path: "/my-projects" },
            { title: siteReport?.projectName ?? t("Project"), path: `/project/${siteReport?.projectUuid}` },
            { title: taskTitle, path: `/project/${siteReport?.projectUuid}/reporting-task/${siteReport?.taskUuid}` },
            { title: reportTitle }
          ]}
        />
        <SiteReportHeader report={siteReport!} reportTitle={headerReportTitle} />
        <StatusBar entityName="site-reports" entity={siteReport} />
        <PageBody>
          <If condition={siteReport?.nothingToReport}>
            <Then>
              <PageRow>
                <PageColumn>
                  <EmptyState
                    iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                    title={t("Nothing to report")}
                    subtitle={t(
                      "You've marked this report as 'Nothing to Report,' indicating there are no updates for this site report. If you wish to add information to this report, please use the edit button."
                    )}
                  />
                </PageColumn>
              </PageRow>
            </Then>
            <Else>
              <PageRow>
                <PageColumn>
                  <EntityMapAndGalleryCard
                    modelName="sites"
                    modelUUID={siteReport?.siteUuid!}
                    modelTitle={t("Site Report")}
                    entityData={site}
                    emptyStateContent={t(
                      "Your gallery is currently empty. Add images by using the 'Edit' button on this site report."
                    )}
                  />
                  <When condition={!!siteReport?.sharedDriveLink}>
                    <Paper>
                      <ButtonField
                        label={t("Shared Drive link")}
                        buttonProps={{
                          as: Link,
                          children: t("View"),
                          href: siteReport?.sharedDriveLink ?? "",
                          target: "_blank"
                        }}
                      />
                    </Paper>
                  </When>
                </PageColumn>
              </PageRow>
              <ContextCondition frameworksShow={[Framework.HBF]}>
                <PageRow>
                  <PageCard title={t("Site Report Files")} gap={8}>
                    <If condition={totalFiles === 0}>
                      <Then>
                        <h3>{t("Files not found")}</h3>
                      </Then>
                      <Else>
                        {sections.map((section, index) => (
                          <Then key={index}>
                            {siteReport?.[section?.property].map((file: any) => (
                              <Paper key={file.uuid}>
                                <ButtonField
                                  key={file.uuid}
                                  label={t(section.name)}
                                  subtitle={t(file.file_name)}
                                  buttonProps={{
                                    as: Link,
                                    children: t("Download"),
                                    href: file.url,
                                    download: true
                                  }}
                                />
                              </Paper>
                            ))}
                          </Then>
                        ))}
                      </Else>
                    </If>
                  </PageCard>
                </PageRow>
              </ContextCondition>
              <PageRow>
                <PageColumn>
                  <PageCard title={t("Reported Data")} gap={8}>
                    <ContextCondition frameworksShow={[Framework.HBF]}>
                      <LongTextField title={t("Sites Changes")}>{siteReport?.polygonStatus}</LongTextField>
                      <LongTextField title={t("ANR Description")}>{siteReport?.technicalNarrative}</LongTextField>
                    </ContextCondition>
                    <ContextCondition frameworksHide={[...ALL_TF, Framework.HBF]}>
                      <LongTextField title={t("Technical Narrative")}>{siteReport?.technicalNarrative}</LongTextField>
                      <LongTextField title={t("Public Narrative")}>{siteReport?.publicNarrative}</LongTextField>
                    </ContextCondition>
                    <ContextCondition frameworksShow={[Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES]}>
                      <LongTextField title={t("Survival Rate")}>{siteReport?.pctSurvivalToDate}</LongTextField>
                      <LongTextField title={t("Description of Survival Rate Calculation")}>
                        {siteReport?.survivalCalculation}
                      </LongTextField>
                      <LongTextField title={t("Explanation of Survival Rate")}>
                        {siteReport?.survivalDescription}
                      </LongTextField>
                      <LongTextField title={t("Maintenance Activities")}>
                        {siteReport?.maintenanceActivities}
                      </LongTextField>
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
                            value: siteReport?.totalTreesPlantedCount!
                          }
                        ]}
                        className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                      />
                      <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                        <TreeSpeciesTable
                          entity="siteReports"
                          entityUuid={siteReportUUID}
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
                            value: siteReport?.totalTreesPlantedCount!
                          }
                        ]}
                        className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                      />
                      <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                        <TreeSpeciesTable
                          entity="siteReports"
                          entityUuid={siteReportUUID}
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
                            value: siteReport?.totalSeedsPlantedCount!
                          }
                        ]}
                        className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                      />
                      <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                        <TreeSpeciesTable
                          entity="siteReports"
                          entityUuid={siteReportUUID}
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
                            label: t("TOTAL seeds PLANTED (ON REPORT):"),
                            variantLabel: "text-14",
                            classNameLabel: " text-neutral-650 uppercase !w-auto",
                            classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                            value: siteReport?.totalNonTreeSpeciesPlantedCount!
                          }
                        ]}
                        className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                      />
                      <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                        <TreeSpeciesTable
                          entity="siteReports"
                          entityUuid={siteReportUUID}
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
                            label: t("TOTAL seeds PLANTED (ON REPORT):"),
                            variantLabel: "text-14",
                            classNameLabel: " text-neutral-650 uppercase !w-auto",
                            classNameLabelValue: "!justify-start ml-2 !text-2xl items-baseline",
                            value: siteReport?.totalTreeReplantingCount!
                          }
                        ]}
                        className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                      />
                      <div className="mb-2 border-b border-dashed border-blueCustom-700 pb-6">
                        <TreeSpeciesTable
                          entity="siteReports"
                          entityUuid={siteReportUUID}
                          collection="replanting"
                          visibleRows={8}
                          galleryType={"treeSpeciesPD"}
                        />
                      </div>
                    </ContextCondition>
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
                            value: siteReport?.numTreesRegenerating!
                          }
                        ]}
                        className="mb-5 mt-4 pr-[41px] lg:pr-[150px]"
                      />
                      <Text variant="text-14" className="uppercase text-neutral-650">
                        {t("Description of ANR Activities:")}
                      </Text>
                      <Text variant="text-16" className="mt-2 text-blueCustom-700">
                        {t(siteReport?.regenerationDescription ?? "No description")}
                      </Text>
                    </div>
                    <div>
                      <Text variant="text-20-bold">{t("Disturbances")}</Text>
                      <DisturbancesTablePD modelName="siteReports" modelUUID={siteReportUUID} />
                    </div>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow frameworksShow={[Framework.HBF]}>
                <PageColumn>
                  <PageCard title={t("Invasive Species Management")}>
                    <LongTextField title={t("Information invasive species and are restored")}>
                      {siteReport?.invasiveSpeciesManagement}
                    </LongTextField>
                    <LongTextField title={t("Post Invasive removal plan")}>
                      {siteReport?.invasiveSpeciesRemoved}
                    </LongTextField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow frameworksShow={[Framework.HBF]}>
                <PageColumn>
                  <PageCard title={t("Soil + Water Management")}>
                    <LongTextField title={t("Soil and Water-Based Restoration Description")}>
                      {siteReport?.soilWaterRestorationDescription}
                    </LongTextField>
                    <LongTextField title={t("Water + Soil Conservation Structures Created")}>
                      {siteReport?.waterStructures}
                    </LongTextField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow frameworksShow={[Framework.HBF]}>
                <PageColumn>
                  <PageCard title={t("Site Socioeconomic Impact")}>
                    <LongTextField title={t("Site Community Partners Description")}>
                      {siteReport?.siteCommunityPartnersDescription}
                    </LongTextField>
                    <LongTextField title={t("Site Income Generating Activities")}>
                      {siteReport?.siteCommunityPartnersIncomeIncreaseDescription}
                    </LongTextField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow>
                <PageColumn frameworksShow={[Framework.HBF, Framework.PPC]}>
                  <PageCard title={t("Site Report Details")}>
                    <TextField label={t("Site Report name")} value={siteReport?.title!} />
                    <TextField label={t("Site name")} value={siteReport?.siteName!} />
                    <TextField
                      label={t("Created by")}
                      value={siteReport?.createdByFirstName ?? "" + " " + siteReport?.createdByLastName ?? ""}
                    />
                    <TextField label={t("Updated")} value={format(siteReport?.updatedAt!)} />
                    <TextField label={t("Due date")} value={format(siteReport?.dueAt!)} />
                    <TextField label={t("Submitted date")} value={format(siteReport?.submittedAt!)} />
                  </PageCard>
                </PageColumn>
                <PageColumn frameworksShow={[Framework.PPC]}>
                  <PageCard title={t("Report Overview")}>
                    <TextField label={t("Workdays Paid")} value={String(workdaysPaid ?? 0)} />
                    <TextField label={t("Workdays Volunteer")} value={String(workdaysVolunteer ?? 0)} />
                  </PageCard>
                  <Paper>
                    <ButtonField
                      label={t("Socioeconomic Benefits")}
                      buttonProps={{
                        as: Link,
                        children: t("Download"),
                        href: siteReport?.socioeconomicBenefits?.[0]?.url ?? "",
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
                      <Loader />
                    ) : (
                      <>
                        <Text variant="text-bold-headline-800">{`Site Reports - ${workdaysTotal}`}</Text>
                        {DemographicCollections.WORKDAYS_SITE.map(collection => (
                          <Fragment key={collection}>
                            {collection === DemographicCollections.WORKDAYS_SITE_OTHER && (
                              <TextField
                                label={t("Other Activities Description")}
                                value={siteReport?.paidOtherActivityDescription!}
                              />
                            )}
                            <DemographicsDisplay
                              entity="siteReports"
                              uuid={siteReportUUID}
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
            </Else>
          </If>
          <br />
          <br />
          <br />
        </PageBody>
        <PageFooter />
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default SiteReportDetailPage;
