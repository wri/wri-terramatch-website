import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useMemo, useState } from "react";

import Button from "@/components/elements/Button/Button";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Table from "@/components/elements/Table/Table";
import { FilterValue } from "@/components/elements/TableFilters/TableFilter";
import Text from "@/components/elements/Text/Text";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import { CompletionStatusMapping } from "@/components/extensive/Tables/ReportingTasksTable";
import WelcomeTour from "@/components/extensive/WelcomeTour/WelcomeTour";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import {
  useFullProject,
  useLightNurseryReportList,
  useLightProjectReport,
  useLightSiteReportList,
  useLightSRPReportList
} from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import {
  NurseryReportLightDto,
  ProjectReportLightDto,
  SiteReportLightDto,
  SrpReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { v3EntityName } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import BulkNothingToReportModal from "@/pages/project/[uuid]/reporting-task/BulkNothingToReportModal";
import ReportingTaskHeader from "@/pages/project/[uuid]/reporting-task/components/ReportingTaskHeader";
import NothingToReportModal from "@/pages/project/[uuid]/reporting-task/NothingToReportModal";
import {
  NOTHING_TO_REPORT_MODELS,
  NothingToReportEntity,
  TaskReportDto
} from "@/pages/project/[uuid]/reporting-task/types";
import useGetReportingTasksTourSteps from "@/pages/project/[uuid]/reporting-task/useGetReportingTasksTourSteps";
import ApiSlice from "@/store/apiSlice";
import { Status } from "@/types/common";

const StatusMapping: { [index: string]: Status } = {
  due: "edit",
  "awaiting-approval": "awaiting",
  approved: "success",
  "needs-more-information": "warning"
};

const NOTHING_TO_REPORT_DISPLAYABLE_STATUSES = ["due", "started"];

const BULK_MODAL_COPY =
  'Indicate here if any of the sites/nurseries below had no activity to report during the reporting period. You can select sites/nurseries individually, or use the "Select All" button if applicable. Be sure to press "Submit" to confirm your selection and send to your project manager for review. <br />Please note: you must report any planting, assisted natural regeneration activities, maintenance, monitoring, or nursery seedlings by filling out the reports for that site/nursery individually.';

export type TaskReport = (ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto | SrpReportLightDto) & {
  completionStatus: string;
  type: "site-report" | "nursery-report" | "project-report" | "srp-report";
  parentName: string;
};

export type TaskReports = {
  mandatory: TaskReport[];
  additional: TaskReport[];
  nothingToReportEligible: TaskReport[];
  srpReports: TaskReport[];
  outstandingMandatoryCount: number;
  outstandingAdditionalCount: number;
};

const shouldShowNothingToReportButton = (report: TaskReport) => {
  const { type, status, completion } = report;
  return (
    NOTHING_TO_REPORT_MODELS.includes(v3EntityName(type) as NothingToReportEntity) &&
    NOTHING_TO_REPORT_DISPLAYABLE_STATUSES.includes(status) &&
    completion != 100
  );
};

const mapTaskReport =
  (format: ReturnType<typeof useDate>["format"]) =>
  (report: TaskReportDto): TaskReport => {
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

const ReportingTaskPage: FC = () => {
  const t = useT();
  const { format } = useDate();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const [tourEnabled, setTourEnabled] = useState(false);
  const reportingTaskUUID = router.query.reportingTaskUUID as string;
  const projectUUID = router.query.uuid as string;

  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [, { data: task, update: updateTask, projectReportUuid, siteReportUuids, nurseryReportUuids, srpReportUuids }] =
    useTask({
      id: reportingTaskUUID
    });
  const [, { data: projectReport }] = useLightProjectReport({ id: projectReportUuid });
  const [, { data: siteReports }] = useLightSiteReportList({ ids: siteReportUuids });
  const [, { data: nurseryReports }] = useLightNurseryReportList({ ids: nurseryReportUuids });
  const [, { data: srpReports }] = useLightSRPReportList({ ids: srpReportUuids });
  const [projectLoaded, { data: project }] = useFullProject({ id: projectUUID });

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

    const nothingToReportEligible = additional.filter(shouldShowNothingToReportButton);

    const mandatory = projectReport == null ? [] : [mapTaskReport(format)(projectReport)];
    return {
      mandatory,
      additional,
      nothingToReportEligible,
      srpReports: srpReports?.map(mapTaskReport(format)) ?? [],
      outstandingMandatoryCount: mandatory.filter(report => report.completion! < 100).length,
      outstandingAdditionalCount: additional.filter(report => report!.completion! < 100).length
    } as TaskReports;
  }, [filters, format, nurseryReports, projectReport, siteReports, srpReports]);

  const tourSteps = useGetReportingTasksTourSteps(reports);

  const nothingToReportHandler = useCallback(
    (entity: NothingToReportEntity, uuid: string) => {
      openModal(ModalId.CONFIRM_UPDATE, <NothingToReportModal entity={entity} uuid={uuid} />);
    },
    [openModal]
  );

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
        const { type, uuid, completionStatus } = record;

        const v3Name = v3EntityName(type);
        const shouldShowButton = shouldShowNothingToReportButton(record);

        const handleClick = useCallback(() => {
          nothingToReportHandler(v3Name as NothingToReportEntity, uuid);
          ApiSlice.pruneCache("actions");
        }, [uuid, v3Name]);

        const renderContinueButton = () => {
          switch (completionStatus) {
            case "not-started":
            case "nothing-to-report":
              return (
                <Button as={Link} href={`/entity/${type}s/create/framework?entity_uuid=${uuid}`}>
                  {t("Write report")}
                </Button>
              );

            case "approved":
            case "awaiting-approval":
              return (
                <Button as={Link} href={`/reports/${type}/${uuid}`}>
                  {t("View Completed Report")}
                </Button>
              );

            case "needs-more-information":
              return (
                <Button as={Link} href={`/reports/${type}/${uuid}`}>
                  {t("View Feedback")}
                </Button>
              );

            default:
              return (
                <Button as={Link} href={`/entity/${type}s/edit/${uuid}`}>
                  {t("Continue report")}
                </Button>
              );
          }
        };

        return (
          <div className="flex justify-end gap-4">
            {shouldShowButton ? (
              <Button id={`nothing-to-report-button-${index}`} variant="secondary" onClick={handleClick}>
                {t("Nothing to report")}
              </Button>
            ) : null}
            {renderContinueButton()}
          </div>
        );
      }
    }
  ];

  const tableColumnsSRP: ColumnDef<RowData>[] = [
    {
      accessorKey: "projectName",
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
        const { uuid, completionStatus } = record;
        const type = "srp-report";
        const shouldShowButton = shouldShowNothingToReportButton(record);

        const handleClick = useCallback(() => {
          nothingToReportHandler("srpReports", uuid);
        }, [uuid]);

        const renderContinueButton = () => {
          switch (completionStatus) {
            case "not-started":
            case "nothing-to-report":
              return (
                <Button as={Link} href={`/entity/${type}s/edit/${uuid}`}>
                  {t("Write report")}
                </Button>
              );

            case "approved":
            case "awaiting-approval":
              return (
                <Button as={Link} href={`/reports/${type}/${uuid}`}>
                  {t("View Completed Report")}
                </Button>
              );

            case "needs-more-information":
              return (
                <Button as={Link} href={`/reports/${type}/${uuid}`}>
                  {t("View Feedback")}
                </Button>
              );

            default:
              return (
                <Button as={Link} href={`/entity/${type}s/edit/${uuid}`}>
                  {t("Continue report")}
                </Button>
              );
          }
        };

        return (
          <div className="flex justify-end gap-4">
            {shouldShowButton ? (
              <Button id={`nothing-to-report-button-${index}`} variant="secondary" onClick={handleClick}>
                {t("Nothing to report")}
              </Button>
            ) : null}
            {renderContinueButton()}
          </div>
        );
      }
    }
  ];

  const openBulkConfirmationModal = useCallback(
    (reports: TaskReport[]) => {
      if (reports.length === 0) return;
      openModal(
        ModalId.CONFIRMATION_MODAL,
        <ModalConfirm
          className="pointer-events-auto z-[99999]"
          title={t("Confirm Bulk Nothing to Report Submission")}
          content={
            <div className="max-h-[140px] overflow-y-auto lg:max-h-[150px]">
              {reports.map(report => (
                <li key={report.uuid} className="text-12-light">
                  {`${report.type === "site-report" ? t("Site") : t("Nursery")} Report - ${report.parentName}`}
                </li>
              ))}
            </div>
          }
          onClose={() => closeModal(ModalId.CONFIRMATION_MODAL)}
          onConfirm={() => {
            updateTask?.({
              siteReportNothingToReportUuids: reports
                .filter(report => report.type === "site-report")
                .map(({ uuid }) => uuid),
              nurseryReportNothingToReportUuids: reports
                .filter(report => report.type === "nursery-report")
                .map(({ uuid }) => uuid)
            });
          }}
        />
      );
    },
    [closeModal, openModal, t, updateTask]
  );

  const openBulkModal = useCallback(() => {
    openModal(
      ModalId.BULK_NOTHING_TO_REPORT,
      <BulkNothingToReportModal
        data={reports.nothingToReportEligible}
        content={t(BULK_MODAL_COPY)}
        onClose={() => closeModal(ModalId.BULK_NOTHING_TO_REPORT)}
        onSubmit={openBulkConfirmationModal}
      />
    );
  }, [closeModal, openBulkConfirmationModal, openModal, reports.nothingToReportEligible, t]);

  if (!projectLoaded) return null;
  return (
    <FrameworkProvider frameworkKey={project?.frameworkKey}>
      <LoadingContainer loading={task == null}>
        <ReportingTaskHeader {...{ project, taskUuid: reportingTaskUUID, reports }} />
        <StatusBar status={StatusMapping?.[task?.status ?? ""]} />
        <PageBody className={classNames(tourEnabled && "pb-52 xl:pb-52")}>
          <PageSection>
            <PageCard title={t("Mandatory Project Report")}>
              <Table data={reports.mandatory} hasPagination={false} columns={tableColumns} />
            </PageCard>
          </PageSection>
          {project?.frameworkKey === "ppc" && (
            <PageSection>
              <PageCard title={t("Annual Socioeconomic Restoration Partners Report")}>
                <Table data={reports.srpReports} hasPagination={false} columns={tableColumnsSRP} />
              </PageCard>
            </PageSection>
          )}
          <PageSection>
            <PageCard
              title={t("Additional Reports")}
              headerChildren={
                <Button disabled={reports.nothingToReportEligible.length === 0} onClick={openBulkModal}>
                  {t('Report "No Updates"')}
                </Button>
              }
            >
              <Table
                data={reports.additional}
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
          <br />
          <br />
          <br />

          <PageFooter />
        </PageBody>
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default ReportingTaskPage;
