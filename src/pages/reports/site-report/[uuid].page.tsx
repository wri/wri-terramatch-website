import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Else, If, Then, When } from "react-if";

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
import { COLLECTION_SITE_PAID_OTHER, SITE_WORKDAY_COLLECTIONS } from "@/constants/workdayCollections";
import { ContextCondition } from "@/context/ContextCondition";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useGetV2ENTITYUUID, useGetV2TasksUUIDReports, useGetV2WorkdaysENTITYUUID } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import useWorkdayData from "@/hooks/useWorkdayData";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import { SiteReportHeader } from "@/pages/reports/site-report/components/SiteReportHeader";
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

  const { data: workdayResponse } = useGetV2WorkdaysENTITYUUID(
    { pathParams: { entity: "site-report", uuid: siteReportUUID } },
    { keepPreviousData: true }
  );

  const { grids: workdayGrids, title: workdaysTitle } = useWorkdayData(
    workdayResponse,
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
                    boundaryGeojson={site?.data?.boundary_geojson}
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
                    <ContextCondition frameworksShow={[Framework.PPC]}>
                      <LongTextField title={t("Technical Narrative")}>{siteReport.technical_narrative}</LongTextField>
                      <LongTextField title={t("Public Narrative")}>{siteReport.public_narrative}</LongTextField>
                    </ContextCondition>
                    <GenericField label={t("Trees Planted")}>
                      <TextField
                        className="mt-2"
                        label={t("Total Trees Planted")}
                        value={siteReport.total_trees_planted_count}
                      />
                      <TreeSpeciesTable modelName="site-report" modelUUID={siteReportUUID} collection="tree-planted" />
                    </GenericField>
                    <GenericField label={t("Direct Seeding")}>
                      <TextField
                        className="mt-2"
                        label={t("Total Direct Seedings")}
                        value={siteReport.total_seeds_planted_count}
                      />
                      <SeedingsTable modelName="site-report" modelUUID={siteReportUUID} type="count" />
                    </GenericField>
                    <GenericField label={t("Disturbances")}>
                      <DisturbancesTable modelName="site-report" modelUUID={siteReportUUID} />
                    </GenericField>
                    <LongTextField frameworksHide={[Framework.PPC]} title={t("Site Changes")}>
                      {siteReport.polygon_status}
                    </LongTextField>
                  </PageCard>
                </PageColumn>
              </PageRow>
              <PageRow>
                <PageColumn>
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
