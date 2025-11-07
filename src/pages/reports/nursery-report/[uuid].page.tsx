import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

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
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullNursery, useFullNurseryReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import NurseryReportHeader from "@/pages/reports/nursery-report/components/NurseryReportHeader";

const NurseryReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const nurseryReportUUID = router.query.uuid as string;

  const [reportLoaded, { data: nurseryReport }] = useFullNurseryReport({ id: nurseryReportUUID });

  const [nurseryLoaded, { data: nursery }] = useFullNursery({ id: nurseryReport?.nurseryUuid! });
  const [taskLoaded, { data: task }] = useTask({ id: nurseryReport?.taskUuid ?? undefined });

  const reportTitle = nurseryReport?.reportTitle ?? nurseryReport?.title ?? t("Nursery Report");
  const headerReportTitle = nursery?.name ? `${nursery?.name} ${reportTitle}` : "";

  const window = useReportingWindow(toFramework(nurseryReport?.frameworkKey), task?.dueAt);
  const taskTitle = t("Reporting Task {window}", { window });

  const isLoaded = reportLoaded && nurseryLoaded && taskLoaded;
  return (
    <FrameworkProvider frameworkKey={nurseryReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        <Head>
          <title>{reportTitle}</title>
        </Head>
        <PageBreadcrumbs
          links={[
            { title: t("My Projects"), path: "/my-projects" },
            { title: nurseryReport?.projectName ?? t("Project"), path: `/project/${nurseryReport?.projectUuid}` },
            {
              title: taskTitle,
              path: `/project/${nurseryReport?.projectUuid}/reporting-task/${nurseryReport?.taskUuid}`
            },
            { title: reportTitle }
          ]}
        />
        <NurseryReportHeader report={nurseryReport!} title={headerReportTitle} />
        <StatusBar entityName="nursery-reports" entity={nurseryReport} />
        <PageBody>
          {nurseryReport?.nothingToReport ? (
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
          ) : (
            <>
              <PageRow>
                <PageColumn>
                  <EntityMapAndGalleryCard
                    modelName="nurseryReports"
                    modelUUID={nurseryReport?.uuid!}
                    entityData={nursery}
                    modelTitle={t("Nursery Report")}
                    emptyStateContent={t(
                      "Your gallery is currently empty. Add images by using the 'Edit' button on this nursery report."
                    )}
                  />
                  {nurseryReport?.sharedDriveLink != null ? (
                    <Paper>
                      <ButtonField
                        label={t("Shared Drive link")}
                        buttonProps={{
                          as: Link,
                          children: t("View"),
                          href: nurseryReport?.sharedDriveLink ?? "",
                          target: "_blank"
                        }}
                      />
                    </Paper>
                  ) : null}
                </PageColumn>
              </PageRow>
              <PageRow>
                <PageColumn>
                  <PageCard title={t("Reported Data")} gap={4}>
                    <LongTextField title={t("Interesting Facts")}>{nurseryReport?.interestingFacts}</LongTextField>
                    <LongTextField title={t("Site Preparation")}>{nurseryReport?.sitePrep}</LongTextField>
                  </PageCard>
                </PageColumn>
                <PageColumn>
                  <PageCard title={t("Nursery Report Details")}>
                    <TextField label={t("Nursery Report name")} value={nurseryReport?.title!} />
                    <TextField label={t("Nursery name")} value={nursery?.name!} />
                    <TextField
                      label={t("Created by")}
                      value={(nurseryReport?.createdByFirstName ?? "") + " " + (nurseryReport?.createdByLastName ?? "")}
                    />
                    <TextField label={t("Updated")} value={format(nurseryReport?.updatedAt!)} />
                    <TextField label={t("Due date")} value={format(nurseryReport?.dueAt!)} />
                    <TextField label={t("Submitted date")} value={format(nurseryReport?.submittedAt!)} />
                  </PageCard>
                  <PageCard title={t("Overview")}>
                    <TextField
                      label={t("Seedling or Young Trees")}
                      value={nurseryReport?.seedlingsYoungTrees?.toString() ?? ""}
                    />
                  </PageCard>
                  <Paper>
                    {nurseryReport?.treeSeedlingContributions?.[0]?.url != null ? (
                      <ButtonField
                        label={t("Tree Seedling Contributions")}
                        subtitle={t(nurseryReport?.treeSeedlingContributions?.[0]?.fileName ?? "")}
                        buttonProps={{
                          as: Link,
                          children: t("Download"),
                          href: nurseryReport?.treeSeedlingContributions?.[0]?.url ?? "",
                          download: true
                        }}
                      />
                    ) : (
                      <TextField label={t("Tree Seedling Contributions")} value={t("No file uploaded")} />
                    )}
                  </Paper>
                </PageColumn>
              </PageRow>
            </>
          )}
        </PageBody>
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default NurseryReportDetailPage;
