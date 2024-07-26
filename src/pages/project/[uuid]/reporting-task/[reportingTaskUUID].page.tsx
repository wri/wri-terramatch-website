import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
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
import FrameworkProvider from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import {
  useGetV2ProjectsUUID,
  useGetV2TasksUUID,
  useGetV2TasksUUIDReports,
  usePutV2ENTITYUUIDNothingToReport
} from "@/generated/apiComponents";
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

const ReportingTaskPage = () => {
  const t = useT();
  const { format } = useDate();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const [tourEnabled, setTourEnabled] = useState(false);
  const reportingTaskUUID = router.query.reportingTaskUUID as string;
  const projectUUID = router.query.uuid as string;

  const [filters, setFilters] = useState<FilterValue[]>([]);
  const { data: reportingTaskData } = useGetV2TasksUUID({ pathParams: { uuid: reportingTaskUUID } });
  const reportingTask = reportingTaskData?.data as any;

  const {
    data: reportsData,
    isLoading,
    refetch
  } = useGetV2TasksUUIDReports({ pathParams: { uuid: reportingTaskUUID } });
  const { data: projectData } = useGetV2ProjectsUUID({
    pathParams: { uuid: projectUUID }
  });
  const project = (projectData?.data ?? {}) as any;

  const { mutate: submitNothingToReport } = usePutV2ENTITYUUIDNothingToReport({
    onSuccess() {
      refetch();
    }
  });

  const reports = useMemo(() => {
    const reports =
      reportsData?.data?.map((report: any) => {
        let completion_status = "started";
        const { status: reportStatus, update_request_status: urStatus } = report;
        // If there is no submitted update request in play, then the report status is the source of
        // truth, otherwise update the UI in accordance with the active update request's status.
        const hasSubmittedUpdateRequest = ["awaiting-approval", "needs-more-information"].includes(urStatus);
        const status = hasSubmittedUpdateRequest ? urStatus : reportStatus;

        if (status === "needs-more-information") {
          completion_status = "needs-more-information";
        } else if (report.nothing_to_report) {
          completion_status = "nothing-to-report";
        } else if (status === "awaiting-approval") {
          completion_status = "awaiting-approval";
        } else if (status === "approved") {
          completion_status = "approved";
        } else if (status === "due") {
          completion_status = "not-started";
        }

        return {
          ...report,
          update_at: completion_status !== "not-started" ? format(report.update_at) : "N/A",
          completion_status
        };
      }) || [];

    const mandatory = reports?.filter(report => report.type === "project-report");
    const additional = reports
      ?.filter(report => report.type !== "project-report")
      .filter((report: any) => {
        for (const filter of filters) {
          if (report?.[filter.filter.accessorKey] !== filter.value) {
            return false;
          }
        }
        return true;
      });

    return {
      mandatory,
      additional,
      outstandingMandatoryCount: mandatory.filter(report => report.completion < 100).length,
      outstandingAdditionalCount: additional.filter(report => report.completion < 100).length
    };
  }, [filters, format, reportsData?.data]);

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
          onClick: () => {
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
      accessorKey: "parent_name",
      header: t("Report")
    },
    {
      accessorKey: "completion_status",
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
      accessorKey: "update_at",
      header: t("Last Update")
    },
    {
      accessorKey: "completion",
      id: "uuid",
      header: "",
      enableSorting: false,
      cell: props => {
        const record = props.row.original as any;

        return (
          <div className="flex justify-end gap-4">
            {!(record.type === "project-report" || record.completion === 100) && (
              <Button
                id={`nothing-to-report-button-${props.row.index}`}
                variant="secondary"
                onClick={() =>
                  nothingToReportHandler(singularEntityNameToPlural(record.type) as ReportsModelNames, record.uuid)
                }
              >
                {t("Nothing to report")}
              </Button>
            )}
            <Switch>
              <Case
                condition={
                  record.completion_status === "not-started" || record.completion_status === "nothing-to-report"
                }
              >
                <Button as={Link} href={`/entity/${record.type}s/create/framework?entity_uuid=${record.uuid}`}>
                  {t("Write report")}
                </Button>
              </Case>
              <Case condition={["approved", "awaiting-approval"].includes(record.completion_status)}>
                <Button as={Link} href={`/reports/${record.type}/${record.uuid}`}>
                  {t("View Completed Report")}
                </Button>
              </Case>
              <Case condition={record.completion_status === "needs-more-information"}>
                <Button as={Link} href={`/reports/${record.type}/${record.uuid}`}>
                  {t("View Feedback")}
                </Button>
              </Case>
              <Default>
                <Button as={Link} href={`/entity/${record.type}s/edit/${record.uuid}`}>
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
    <FrameworkProvider frameworkKey={project.framework_key}>
      <LoadingContainer loading={isLoading}>
        <ReportingTaskHeader {...{ project, reportingTask, reports }} />
        <StatusBar status={StatusMapping?.[reportingTask?.status]} />
        <PageBody className={classNames(tourEnabled && "pb-52 xl:pb-52")}>
          <PageSection>
            <PageCard title={t("Mandatory Project Report")}>
              <Table data={reports.mandatory} hasPagination={false} columns={tableColumns} />
            </PageCard>
          </PageSection>
          <PageSection>
            <PageCard title={t("Additional Reports")}>
              <Table
                data={reports.additional}
                columns={tableColumns}
                onTableStateChange={state => setFilters(state.filters)}
                hasPagination={true}
                initialTableState={{ pagination: { pageSize: 15 } }}
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
                    hide: project.framework_key === "ppc"
                  },
                  {
                    type: "dropDown",
                    accessorKey: "completion_status",
                    label: t("Report Status"),
                    options: Object.entries(CompletionStatusMapping(t)).map(([value, status]: any) => ({
                      title: status.statusText,
                      value
                    }))
                  }
                ]}
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
  );
};

export default ReportingTaskPage;
