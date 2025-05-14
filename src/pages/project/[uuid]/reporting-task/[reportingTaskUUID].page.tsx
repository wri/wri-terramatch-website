import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { Case, Default, Switch } from "react-if";

import Button from "@/components/elements/Button/Button";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Table from "@/components/elements/Table/Table";
import { FilterValue } from "@/components/elements/TableFilters/TableFilter";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import { CompletionStatusMapping } from "@/components/extensive/Tables/ReportingTasksTable";
import WelcomeTour from "@/components/extensive/WelcomeTour/WelcomeTour";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import {
  useFullProject,
  useLightNurseryReportList,
  useLightProjectReport,
  useLightSiteReportList
} from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { usePutV2ENTITYUUIDNothingToReport } from "@/generated/apiComponents";
import {
  NurseryReportLightDto,
  ProjectReportLightDto,
  SiteReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import ReportingTaskHeader from "@/pages/project/[uuid]/reporting-task/components/ReportingTaskHeader";
import useGetReportingTasksTourSteps from "@/pages/project/[uuid]/reporting-task/useGetReportingTasksTourSteps";
import { ReportsModelNames, Status } from "@/types/common";

const StatusMapping: { [index: string]: Status } = {
  due: "edit",
  "awaiting-approval": "awaiting",
  approved: "success",
  "needs-more-information": "warning"
};

const NOTHING_TO_REPORT_DISPLAYABLE_STATUSES = ["due", "started"];

export type TaskReport = (ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto) & {
  completionStatus: string;
  type: "site-report" | "nursery-report" | "project-report";
  parentName: string;
};

export type TaskReports = {
  mandatory: TaskReport[];
  additional: TaskReport[];
  outstandingMandatoryCount: number;
  outstandingAdditionalCount: number;
};

const mapTaskReport =
  (format: ReturnType<typeof useDate>["format"]) =>
  (report: ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto): TaskReport => {
    let completionStatus = "started";
    const { status: reportStatus, updateRequestStatus } = report;
    // If there is no submitted update request in play, then the report status is the source of
    // truth, otherwise update the UI in accordance with the active update request's status.
    const hasSubmittedUpdateRequest = ["awaiting-approval", "needs-more-information"].includes(updateRequestStatus!);
    const status = hasSubmittedUpdateRequest ? updateRequestStatus : reportStatus;

    if (status === "needs-more-information") {
      completionStatus = "needs-more-information";
    } else if ((report as SiteReportLightDto | NurseryReportLightDto).nothingToReport) {
      completionStatus = "nothing-to-report";
    } else if (status === "awaiting-approval") {
      completionStatus = "awaiting-approval";
    } else if (status === "approved") {
      completionStatus = "approved";
    } else if (status === "due") {
      completionStatus = "not-started";
    }

    const type =
      (report as SiteReportLightDto).siteUuid != null
        ? "site-report"
        : (report as NurseryReportLightDto).nurseryUuid != null
        ? "nursery-report"
        : "project-report";
    const parentName =
      (report as SiteReportLightDto).siteUuid != null
        ? (report as SiteReportLightDto).siteName
        : (report as NurseryReportLightDto).nurseryUuid != null
        ? (report as NurseryReportLightDto).nurseryName
        : report.projectName;

    return {
      ...report,
      updatedAt: completionStatus !== "not-started" ? format(report.updatedAt) : "N/A",
      completionStatus,
      type,
      parentName: parentName ?? ""
    };
  };

const ReportingTaskPage = () => {
  const t = useT();
  const { format } = useDate();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const [tourEnabled, setTourEnabled] = useState(false);
  const reportingTaskUUID = router.query.reportingTaskUUID as string;
  const projectUUID = router.query.uuid as string;
  const [reportsTableData, setReportsTableData] = useState([] as TaskReport[]);

  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [, { task, projectReportUuid, siteReportUuids, nurseryReportUuids }] = useTask({
    uuid: reportingTaskUUID
  });
  const [, { entity: projectReport }] = useLightProjectReport({ uuid: projectReportUuid });
  const [, { entities: siteReports }] = useLightSiteReportList({ uuids: siteReportUuids });
  const [, { entities: nurseryReports }] = useLightNurseryReportList({ uuids: nurseryReportUuids });
  const [projectLoaded, { entity: project }] = useFullProject({ uuid: projectUUID });

  const { mutate: submitNothingToReport } = usePutV2ENTITYUUIDNothingToReport({
    onSuccess: result => {
      const report = (result as unknown as { data: TaskReport })?.data;
      if (report == null) return;

      const index = reportsTableData.findIndex(({ uuid }) => uuid === report.uuid);
      if (index >= 0) {
        const tableData = [...reportsTableData];
        tableData[index] = mapTaskReport(format)(report);
        setReportsTableData(tableData);
      }
    }
  });

  const reports = useMemo(() => {
    const additional = [...(siteReports ?? []), ...(nurseryReports ?? [])].map(mapTaskReport(format)).filter(report => {
      for (const filter of filters) {
        const value = report[filter.filter.accessorKey as keyof TaskReport];
        if (value !== filter.value) {
          return false;
        }
      }
      return true;
    });

    setReportsTableData(additional);

    const mandatory = projectReport == null ? [] : [mapTaskReport(format)(projectReport)];
    return {
      mandatory,
      additional,
      outstandingMandatoryCount: mandatory.filter(report => report.completion! < 100).length,
      outstandingAdditionalCount: additional.filter(report => report!.completion! < 100).length
    } as TaskReports;
  }, [filters, format, nurseryReports, projectReport, siteReports]);

  const tourSteps = useGetReportingTasksTourSteps(reports);

  const nothingToReportHandler = (entity: ReportsModelNames, uuid: string) => {
    openModal(
      ModalId.CONFIRM_UPDATE,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Are you sure you don't want to provide any updates for this {entity}?", {
          entity: entity === "site-reports" ? t("site") : t("nursery")
        })}
        content={t(
          "If you choose not to report anything, it will tell WRI that there was no planting done at these restoration {entity}. Are you sure you want to continue? This can't be undone.",
          {
            entity: entity === "site-reports" ? t("site") : t("nursery")
          }
        )}
        primaryButtonProps={{
          children: t("Nothing to report"),
          onClick: async () => {
            submitNothingToReport({ pathParams: { entity, uuid } });
            closeModal(ModalId.CONFIRM_UPDATE);
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.CONFIRM_UPDATE)
        }}
      />
    );
  };

  const tableColumns: ColumnDef<RowData>[] = [
    {
      accessorKey: "parentName",
      header: t("Report")
    },
    {
      accessorKey: "completionStatus",
      header: t("Status"),
      cell: props => {
        const value = props.getValue() as string;
        const { status, statusText } = CompletionStatusMapping(t)?.[value] || {};
        if (!status) return null;

        return (
          <StatusPill status={status} className="w-fit">
            <Text variant="text-bold-caption-100">{statusText}</Text>
          </StatusPill>
        );
      }
    },
    {
      accessorKey: "completion",
      header: t("Completion"),
      cell: props => {
        return `${props.getValue()}%`;
      }
    },
    {
      accessorKey: "updatedAt",
      header: t("Last Update")
    },
    {
      accessorKey: "completionStatus",
      id: "uuid",
      header: "",
      enableSorting: false,
      cell: props => {
        const record = props.row.original as TaskReport;
        const { index } = props.row;
        const { status, type, completion, uuid, completionStatus } = record;

        const shouldShowButton =
          NOTHING_TO_REPORT_DISPLAYABLE_STATUSES.includes(status) && !(type === "project-report" || completion === 100);

        const handleClick = useCallback(() => {
          nothingToReportHandler(singularEntityNameToPlural(type) as ReportsModelNames, uuid);
        }, [type, uuid]);

        return (
          <div className="flex justify-end gap-4">
            {shouldShowButton ? (
              <Button id={`nothing-to-report-button-${index}`} variant="secondary" onClick={handleClick}>
                {t("Nothing to report")}
              </Button>
            ) : null}
            <Switch>
              <Case condition={completionStatus === "not-started" || completionStatus === "nothing-to-report"}>
                <Button as={Link} href={`/entity/${type}s/create/framework?entity_uuid=${uuid}`}>
                  {t("Write report")}
                </Button>
              </Case>
              <Case condition={["approved", "awaiting-approval"].includes(completionStatus)}>
                <Button as={Link} href={`/reports/${type}/${uuid}`}>
                  {t("View Completed Report")}
                </Button>
              </Case>
              <Case condition={completionStatus === "needs-more-information"}>
                <Button as={Link} href={`/reports/${type}/${uuid}`}>
                  {t("View Feedback")}
                </Button>
              </Case>
              <Default>
                <Button as={Link} href={`/entity/${type}s/edit/${uuid}`}>
                  {t("Continue report")}
                </Button>
              </Default>
            </Switch>
          </div>
        );
      }
    }
  ];

  return (
    projectLoaded && (
      <FrameworkProvider frameworkKey={project?.frameworkKey}>
        <LoadingContainer loading={task == null}>
          <ReportingTaskHeader {...{ project, task, reports }} />
          <StatusBar status={StatusMapping?.[task?.status ?? ""]} />
          <PageBody className={classNames(tourEnabled && "pb-52 xl:pb-52")}>
            <PageSection>
              <PageCard title={t("Mandatory Project Report")}>
                <Table data={reports.mandatory} hasPagination={false} columns={tableColumns} />
              </PageCard>
            </PageSection>
            <PageSection>
              <PageCard title={t("Additional Reports")}>
                <Table
                  data={reportsTableData}
                  columns={tableColumns}
                  onTableStateChange={state => setFilters(state.filters)}
                  hasPagination={true}
                  resetOnDataChange={false}
                  initialTableState={{ pagination: { pageSize: 10 } }}
                  columnFilters={[
                    {
                      type: "dropDown",
                      accessorKey: "type",
                      label: t("Report type"),
                      options: [
                        {
                          title: t("Site"),
                          value: "site-report"
                        },
                        {
                          title: t("Nursery"),
                          value: "nursery-report"
                        }
                      ],
                      hide: project?.frameworkKey === "ppc"
                    },
                    {
                      type: "dropDown",
                      accessorKey: "completionStatus",
                      label: t("Report Status"),
                      options: Object.entries(CompletionStatusMapping(t)).map(([value, status]: any) => ({
                        title: status.statusText,
                        value
                      }))
                    }
                  ]}
                  alwaysShowPagination
                />
              </PageCard>
            </PageSection>
            <WelcomeTour
              tourId="reporting-tasks"
              hasWelcomeModal={false}
              tourSteps={tourSteps}
              onStart={() => setTourEnabled(true)}
              onFinish={() => setTourEnabled(false)}
            />
          </PageBody>
        </LoadingContainer>
      </FrameworkProvider>
    )
  );
};

export default ReportingTaskPage;
