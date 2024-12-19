import { Box } from "@mui/system";
import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Else, If, Then, When } from "react-if";

import TreeSpeciesTableTF from "@/admin/components/Tables/TreeSpeciesTableTF";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ButtonField from "@/components/elements/Field/ButtonField";
import GenericField from "@/components/elements/Field/GenericField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import EntityMapAndGalleryCard from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbancesTable from "@/components/extensive/Tables/DisturbancesTable";
import SeedingsTable from "@/components/extensive/Tables/SeedingsTable";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { EstablishmentEntityType } from "@/connections/EstablishmentTrees";
import { COLLECTION_SITE_PAID_OTHER, SITE_WORKDAY_COLLECTIONS } from "@/constants/workdayCollections";
import { ContextCondition } from "@/context/ContextCondition";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useGetV2ENTITYUUID, useGetV2TasksUUIDReports } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import useDemographicData from "@/hooks/useDemographicData";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import SiteReportHeader from "@/pages/reports/site-report/components/SiteReportHeader";
import { getFullName } from "@/utils/user";

const SiteReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const siteReportUUID = router.query.uuid as string;

  const { data, isLoading } = useGetV2ENTITYUUID({
    pathParams: { uuid: siteReportUUID, entity: "site-reports" }
  });
  const siteReport = (data?.data ?? {}) as any;

  const { data: site } = useGetV2ENTITYUUID(
    {
      pathParams: { uuid: siteReport?.site?.uuid, entity: "sites" }
    },
    {
      enabled: !!siteReport?.site?.uuid
    }
  );

  const { data: taskReportsData } = useGetV2TasksUUIDReports({ pathParams: { uuid: siteReport.task_uuid } });
  const projectReport = taskReportsData?.data?.filter(report => report.type === "project-report")?.[0] ?? {};
  const reportTitle = siteReport.report_title ?? siteReport.title ?? t("Site Report");

  const { grids: workdayGrids, title: workdaysTitle } = useDemographicData(
    "site-report",
    "workdays",
    siteReportUUID,
    SITE_WORKDAY_COLLECTIONS,
    "Site Workdays"
  );

  return (
    <FrameworkProvider frameworkKey={siteReport.framework_key}>
      <LoadingContainer loading={isLoading}>
        <Head>
          <title>{reportTitle}</title>
        </Head>
        <PageBreadcrumbs
          links={[
            { title: t("My Projects"), path: "/my-projects" },
            { title: siteReport.project?.name ?? t("Project"), path: `/project/${siteReport.project?.uuid}` },
            { title: siteReport.project_report_title, path: `/reports/project-report/${projectReport.uuid}` },
            { title: reportTitle }
          ]}
        />
        <SiteReportHeader report={siteReport} reportTitle={reportTitle} />
        <StatusBar entityName="site-reports" entity={siteReport} />
        <PageBody>
          <If condition={siteReport.nothing_to_report}>
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
                    modelName="site-reports"
                    modelUUID={siteReport.uuid}
                    modelTitle={t("Site Report")}
                    entityData={site}
                    emptyStateContent={t(
                      "Your gallery is currently empty. Add images by using the 'Edit' button on this site report."
                    )}
                  />
                  <When condition={!!siteReport.shared_drive_link}>
                    <Paper>
                      <ButtonField
                        label={t("Shared Drive link")}
                        buttonProps={{
                          as: Link,
                          children: t("View"),
                          href: siteReport.shared_drive_link ?? "",
                          target: "_blank"
                        }}
                      />
                    </Paper>
                  </When>
                </PageColumn>
              </PageRow>
              <PageRow>
                <PageColumn>
                  <PageCard title={t("Reported Data")} gap={8}>
                    <ContextCondition frameworksShow={[Framework.HBF]}>
                      <LongTextField title={t("Sites Changes")}>{siteReport.polygon_status}</LongTextField>
                      <LongTextField title={t("ANR Description")}>{siteReport.technical_narrative}</LongTextField>
                    </ContextCondition>
                    <ContextCondition frameworksHide={[Framework.HBF]}>
                      <LongTextField title={t("Technical Narrative")}>{siteReport.technical_narrative}</LongTextField>
                      <LongTextField title={t("Public Narrative")}>{siteReport.public_narrative}</LongTextField>
                    </ContextCondition>
                    <ContextCondition frameworksHide={[Framework.HBF, Framework.PPC]}>
                      <TreeSpeciesTableTF
                        uuid={siteReportUUID}
                        entity={"site-report" as EstablishmentEntityType}
                        total={siteReport.total_trees_planted_count}
                        totalText={t("TOTAL TREES PLANTED (ON REPORT)")}
                        title={t("Trees Planted")}
                        countColumnName={t("TREE COUNT")}
                        collection="tree-planted"
                      />
                      <TreeSpeciesTableTF
                        uuid={siteReportUUID}
                        entity={"site-report" as EstablishmentEntityType}
                        total={siteReport.total_non_tree_species_planted_count}
                        totalText={t("TOTAL NON-TREES SPECIES PLANTED (ON REPORT)")}
                        title={t("Non-Trees Planted")}
                        countColumnName={t("NON-TREE COUNT")}
                        collection="non-tree"
                      />
                      <TreeSpeciesTableTF
                        uuid={siteReportUUID}
                        entity={"site-report" as EstablishmentEntityType}
                        total={siteReport.total_tree_replanting_count}
                        totalText={t("TOTAL TREE REPLANTING (ON REPORT)")}
                        title={t("Tree Replanting")}
                        countColumnName={t("TREE REPLANTING COUNT")}
                        collection="replanting"
                      />
                      <Box paddingX={3} paddingY={1}>
                        <Text variant="text-24-bold" className="text-darkCustom">
                          {t("Assisted Natural Regeneration")}
                        </Text>
                      </Box>
                      <Box paddingX={3} paddingY={1}>
                        <Text variant="text-16-semibold" className="text-grey-500">
                          {t("DESCRIPTION OF ANR ACTIVITIES")}:
                        </Text>
                        <Text variant="text-14-light" className="text-black">
                          {siteReport.regeneration_description}
                        </Text>
                      </Box>
                    </ContextCondition>
                    <GenericField label={t("Trees Planted")} frameworksShow={[Framework.PPC, Framework.HBF]}>
                      <TextField
                        className="mt-2"
                        label={t("Total Trees Planted")}
                        value={siteReport.total_trees_planted_count}
                      />
                      <TreeSpeciesTable modelName="site-report" modelUUID={siteReportUUID} collection="tree-planted" />
                    </GenericField>
                    <GenericField label={t("Direct Seeding")} frameworksShow={[Framework.PPC]}>
                      <TextField
                        className="mt-2"
                        label={t("Total Direct Seedings")}
                        value={siteReport.total_seeds_planted_count}
                      />
                      <SeedingsTable modelName="site-report" modelUUID={siteReportUUID} type="count" />
                    </GenericField>
                    <GenericField label={t("Non-Tree Species Planted")} frameworksShow={[Framework.HBF]}>
                      <TextField
                        className="mt-2"
                        label={t("Total Non-Trees Planted")}
                        value={siteReport.total_non_tree_species_planted_count}
                      />
                      <TreeSpeciesTable modelName="site-report" modelUUID={siteReportUUID} collection="non-tree" />
                    </GenericField>
                    <GenericField label={t("Disturbances")}>
                      <DisturbancesTable modelName="site-report" modelUUID={siteReportUUID} />
                    </GenericField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow frameworksShow={[Framework.HBF]}>
                <PageColumn>
                  <PageCard title={t("Invasive Species Management")}>
                    <LongTextField title={t("Information invasive species and are restored")}>
                      {siteReport.invasive_species_management}
                    </LongTextField>
                    <LongTextField title={t("Post Invasive removal plan")}>
                      {siteReport.invasive_species_removed}
                    </LongTextField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow frameworksShow={[Framework.HBF]}>
                <PageColumn>
                  <PageCard title={t("Soil + Water Management")}>
                    <LongTextField title={t("Soil and Water-Based Restoration Description")}>
                      {siteReport.soil_water_restoration_description}
                    </LongTextField>
                    <LongTextField title={t("Water + Soil Conservation Structures Created")}>
                      {siteReport.water_structures}
                    </LongTextField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow frameworksShow={[Framework.HBF]}>
                <PageColumn>
                  <PageCard title={t("Site Socioeconomic Impact")}>
                    <LongTextField title={t("Site Community Partners Description")}>
                      {siteReport.site_community_partners_description}
                    </LongTextField>
                    <LongTextField title={t("Site Income Generating Activities")}>
                      {siteReport.site_community_partners_income_increase_description}
                    </LongTextField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow>
                <PageColumn frameworksShow={[Framework.HBF, Framework.PPC]}>
                  <PageCard title={t("Site Report Details")}>
                    <TextField label={t("Site Report name")} value={siteReport.title} />
                    <TextField label={t("Site name")} value={siteReport.site?.name} />
                    <TextField label={t("Created by")} value={getFullName(siteReport.created_by)} />
                    <TextField label={t("Updated")} value={format(siteReport.updated_at)} />
                    <TextField label={t("Due date")} value={format(siteReport.due_at)} />
                    <TextField label={t("Submitted date")} value={format(siteReport.submitted_at)} />
                  </PageCard>
                </PageColumn>
                <PageColumn frameworksShow={[Framework.PPC]}>
                  <PageCard title={t("Report Overview")}>
                    <TextField label={t("Workdays Paid")} value={siteReport.workdays_paid} />
                    <TextField label={t("Workdays Volunteer")} value={siteReport.workdays_volunteer} />
                  </PageCard>
                  <Paper>
                    <ButtonField
                      label={t("Socioeconomic Benefits")}
                      buttonProps={{
                        as: Link,
                        children: t("Download"),
                        href: siteReport?.socioeconomic_benefits?.[0]?.url ?? "",
                        download: true
                      }}
                    />
                  </Paper>
                </PageColumn>
              </PageRow>
              <PageRow frameworksShow={[Framework.PPC]}>
                <PageColumn>
                  <PageCard>
                    {workdayGrids.length == 0 ? (
                      <Loader />
                    ) : (
                      <Fragment>
                        <Text variant="text-bold-headline-800">{workdaysTitle}</Text>
                        {workdayGrids.map(({ collection, grid }) => (
                          <If key={collection} condition={collection === COLLECTION_SITE_PAID_OTHER}>
                            <Then>
                              <TextField
                                label={t("Other Activities Description")}
                                value={siteReport.paid_other_activity_description}
                              />
                              {grid}
                            </Then>
                            <Else>
                              <Then key={collection}>{grid}</Then>
                            </Else>
                          </If>
                        ))}
                      </Fragment>
                    )}
                  </PageCard>
                </PageColumn>
              </PageRow>
            </Else>
          </If>
        </PageBody>
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default SiteReportDetailPage;
