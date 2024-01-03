import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ButtonField from "@/components/elements/Field/ButtonField";
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
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ENTITYUUID, useGetV2TasksUUIDReports } from "@/generated/apiComponents";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useDate } from "@/hooks/useDate";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import { getFullName } from "@/utils/user";

const NurseryReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const nurseryReportUUID = router.query.uuid as string;
  const { data, isLoading } = useGetV2ENTITYUUID({
    pathParams: { uuid: nurseryReportUUID, entity: "nursery-reports" }
  });
  const nurseryReport = (data?.data || {}) as any;

  const { data: nursery } = useGetV2ENTITYUUID(
    {
      pathParams: { uuid: nurseryReport?.nursery_id?.uuid, entity: "nurseries" }
    },
    {
      enabled: !!nurseryReport?.nursery_id?.uuid
    }
  );

  const { handleExport } = useGetExportEntityHandler("nursery-reports", nurseryReport.uuid, nurseryReport.name);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nursery-reports",
    entityUUID: nurseryReportUUID,
    entityStatus: nurseryReport.status,
    updateRequestStatus: nurseryReport.update_request_status
  });

  const { data: taskReportsData } = useGetV2TasksUUIDReports({ pathParams: { uuid: nurseryReport.task_uuid } });
  const projectReport = taskReportsData?.data?.filter(report => report.type === "project-report")?.[0] || {};

  const reportTitle = nurseryReport.report_title || nurseryReport.title || t("Nursery Report");

  return (
    <LoadingContainer loading={isLoading}>
      <Head>
        <title>{reportTitle}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my-projects" },
          { title: nurseryReport.project?.name ?? t("Project"), path: `/project/${nurseryReport.project?.uuid}` },
          { title: nurseryReport.project_report_title, path: `/reports/project-report/${projectReport.uuid}` },
          { title: reportTitle }
        ]}
      />
      <PageHeader
        className="h-[203px]"
        title={reportTitle}
        subtitles={[
          `${t("Organisation")}: ${nurseryReport.organisation?.name}`,
          nurseryReport.framework_key === "ppc" ? t("Priceless Planet Coalition") : t("Terrafund")
        ]}
        hasBackButton={false}
      >
        <div className="flex gap-4">
          <When condition={!nurseryReport.nothing_to_report}>
            <Button variant="secondary" onClick={handleExport}>
              {t("Export")}
            </Button>
          </When>
          <Button onClick={handleEdit}>{t("Edit")}</Button>
        </div>
      </PageHeader>
      <StatusBar entityName="nursery-reports" entity={nurseryReport} />
      <PageBody>
        <If condition={nurseryReport.nothing_to_report}>
          <Then>
            <PageRow>
              <PageColumn>
                <EmptyState
                  iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                  title={t("Nothing to report")}
                  subtitle={t(
                    "You've marked this report as 'Nothing to Report,' indicating there are no updates for this nursery report. If you wish to add information to this report, please use the edit button."
                  )}
                />
              </PageColumn>
            </PageRow>
          </Then>
          <Else>
            <PageRow>
              <PageColumn>
                <EntityMapAndGalleryCard
                  modelName="nursery-reports"
                  modelUUID={nurseryReport.uuid}
                  modelTitle={t("Nursery Report")}
                  boundaryGeojson={nursery?.data?.boundary_geojson}
                  emptyStateContent={t(
                    "Your gallery is currently empty. Add images by using the 'Edit' button on this nursery report."
                  )}
                />
                <When condition={!!nurseryReport.shared_drive_link}>
                  <Paper>
                    <ButtonField
                      label={t("Shared Drive link")}
                      buttonProps={{
                        as: Link,
                        children: t("View"),
                        href: nurseryReport.shared_drive_link || "",
                        target: "_blank"
                      }}
                    />
                  </Paper>
                </When>
              </PageColumn>
            </PageRow>
            <PageRow>
              <PageColumn>
                <PageCard title={t("Reported Data")} gap={4}>
                  <LongTextField title={t("Interesting Facts")}>{nurseryReport.interesting_facts}</LongTextField>
                  <LongTextField title={t("Site Preparation")}>{nurseryReport.site_prep}</LongTextField>
                </PageCard>
              </PageColumn>
              <PageColumn>
                <PageCard title={t("Nursery Report Details")}>
                  <TextField label={t("Nursery Report name")} value={nurseryReport.title} />
                  <TextField label={t("Nursery name")} value={nurseryReport.nursery?.name} />
                  <TextField label={t("Created by")} value={getFullName(nurseryReport.created_by)} />
                  <TextField label={t("Updated")} value={format(nurseryReport.updated_at)} />
                  <TextField label={t("Due date")} value={format(nurseryReport.due_at)} />
                </PageCard>
                <PageCard title={t("Overview")}>
                  <TextField label={t("Seedling or Young Trees")} value={nurseryReport.seedlings_young_trees} />
                </PageCard>
                <Paper>
                  <If condition={!!nurseryReport?.tree_seedling_contributions?.[0]?.url}>
                    <Then>
                      <ButtonField
                        label={t("Tree Seedling Contributions")}
                        subtitle={t(nurseryReport?.tree_seedling_contributions?.[0]?.file_name || "")}
                        buttonProps={{
                          as: Link,
                          children: t("Download"),
                          href: nurseryReport?.tree_seedling_contributions?.[0]?.url || "",
                          download: true
                        }}
                      />
                    </Then>
                    <Else>
                      <Then>
                        <TextField label={t("Tree Seedling Contributions")} value={t("No file uploaded")} />
                      </Then>
                    </Else>
                  </If>
                </Paper>
              </PageColumn>
            </PageRow>
          </Else>
        </If>
      </PageBody>
    </LoadingContainer>
  );
};

export default NurseryReportDetailPage;
