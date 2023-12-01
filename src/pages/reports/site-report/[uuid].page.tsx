import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ButtonField from "@/components/elements/Field/ButtonField";
import GenericField from "@/components/elements/Field/GenericField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import EntityMapAndGalleryCard from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbancesTable from "@/components/extensive/Tables/DisturbancesTable";
import SeedingsTable from "@/components/extensive/Tables/SeedingsTable";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import WorkdaysTable from "@/components/extensive/Tables/WorkdaysTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { getReadableWorkdayCollectionName, SITE_WORKDAY_COLLECTIONS } from "@/constants/workdayCollections";
import { useGetV2ENTITYUUID, useGetV2TasksUUIDReports } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useFramework } from "@/hooks/useFramework";
import { useGetEditEntityHandler } from "@/hooks/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/useGetExportEntityHandler";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import { getFullName } from "@/utils/user";

const SiteReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const siteReportUUID = router.query.uuid as string;

  const { data, isLoading } = useGetV2ENTITYUUID({
    pathParams: { uuid: siteReportUUID, entity: "site-reports" }
  });
  const siteReport = (data?.data || {}) as any;

  const { data: site } = useGetV2ENTITYUUID(
    {
      pathParams: { uuid: siteReport?.site?.uuid, entity: "sites" }
    },
    {
      enabled: !!siteReport?.site?.uuid
    }
  );
  const { isPPC } = useFramework(siteReport);
  const { handleExport } = useGetExportEntityHandler("site-reports", siteReport.uuid, siteReport.name);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "site-reports",
    entityUUID: siteReportUUID,
    entityStatus: siteReport.status,
    updateRequestStatus: siteReport.update_request_status
  });

  const { data: taskReportsData } = useGetV2TasksUUIDReports({ pathParams: { uuid: siteReport.task_uuid } });
  const projectReport = taskReportsData?.data?.filter(report => report.type === "project-report")?.[0] || {};
  const reportTitle = siteReport.report_title || siteReport.title || t("Site Report");

  return (
    <LoadingContainer loading={isLoading}>
      <Head>
        <title>{reportTitle}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my/projects" },
          { title: siteReport.project?.name ?? t("Project"), path: `/project/${siteReport.project?.uuid}` },
          { title: siteReport.project_report_title, path: `/reports/project-report/${projectReport.uuid}` },
          { title: reportTitle }
        ]}
      />
      <PageHeader
        className="h-[203px]"
        title={reportTitle}
        subtitles={[
          `${t("Organisation")}: ${siteReport.organisation?.name}`,
          isPPC ? t("Priceless Planet Coalition") : t("Terrafund")
        ]}
        hasBackButton={false}
      >
        <div className="flex gap-4">
          <When condition={!siteReport.nothing_to_report}>
            <Button variant="secondary" onClick={handleExport}>
              {t("Export")}
            </Button>
          </When>
          <Button onClick={handleEdit}>{t("Edit")}</Button>
        </div>
      </PageHeader>
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
                        href: siteReport.shared_drive_link || "",
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
                  <When condition={isPPC}>
                    <LongTextField title={t("Technical Narrative")}>{siteReport.technical_narrative}</LongTextField>
                    <LongTextField title={t("Public Narrative")}>{siteReport.public_narrative}</LongTextField>
                  </When>
                  <GenericField label={t("Trees Planted")}>
                    <TreeSpeciesTable modelName="site-report" modelUUID={siteReportUUID} />
                  </GenericField>
                  <GenericField label={t("Direct Seeding")}>
                    <SeedingsTable modelName="site-report" modelUUID={siteReportUUID} type="count" />
                  </GenericField>
                  <GenericField label={t("Disturbances")}>
                    <DisturbancesTable modelName="site-report" modelUUID={siteReportUUID} />
                  </GenericField>
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
                  <TextField label={t("Submitted date")} value={format(siteReport.due_at)} />
                </PageCard>
              </PageColumn>
              <When condition={isPPC}>
                <PageColumn>
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
                        href: siteReport?.socioeconomic_benefits?.[0]?.url || "",
                        download: true
                      }}
                    />
                  </Paper>
                </PageColumn>
              </When>
            </PageRow>
            <If condition={siteReport?.project?.framework_key === "ppc"}>
              <Then>
                <PageRow>
                  <PageColumn>
                    {SITE_WORKDAY_COLLECTIONS.map(collection => (
                      <PageCard title={getReadableWorkdayCollectionName(collection, t)} gap={4} key={collection}>
                        <WorkdaysTable modelName="site-report" modelUUID={siteReport.uuid} collection={collection} />
                      </PageCard>
                    ))}
                  </PageColumn>
                </PageRow>
              </Then>
            </If>
          </Else>
        </If>
      </PageBody>
    </LoadingContainer>
  );
};

export default SiteReportDetailPage;
