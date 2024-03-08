import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import classNames from "classnames";
import Head from "next/head";
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
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import { CompletionStatusMapping } from "@/components/extensive/Tables/ReportingTasksTable";
import WelcomeTour from "@/components/extensive/WelcomeTour/WelcomeTour";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useModalContext } from "@/context/modal.provider";
import {
  useGetV2ProjectsUUID,
  useGetV2TasksUUID,
  useGetV2TasksUUIDReports,
  usePutV2ENTITYUUIDNothingToReport,
  usePutV2TasksUUIDSubmit
} from "@/generated/apiComponents";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { useGetReportingWindow } from "@/hooks/useGetReportingWindow";
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
  const { getReportingWindow } = useGetReportingWindow();
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
  const project = (projectData?.data || {}) as any;

  const { mutate: submitReportingTask } = usePutV2TasksUUIDSubmit({
    onSuccess() {
      openModal(
        <Modal
          title={t("Reports submitted")}
          content={t(
            "Your reports have been submitted. You can view them in the ‘completed’ reports sections in your project page"
          )}
          iconProps={{
            height: 60,
            width: 60,
            className: "fill-secondary",
            name: IconNames.EXCLAMATION_CIRCLE
          }}
          primaryButtonProps={{
            children: "Close",
            onClick: () => {
              closeModal();
              router.replace(`/project/${projectUUID}?tab=reporting-tasks`);
            }
          }}
        />
      );
    }
  });

  const { mutate: submitNothingToReport } = usePutV2ENTITYUUIDNothingToReport({
    onSuccess() {
      refetch();
    }
  });

  const title =
    t("Reporting Task") +
    ` ${getReportingWindow(reportingTask?.due_at, project.framework_key === "ppc" ? "quarterly" : "bi-annually")}`;

  const reports = useMemo(() => {
    const reports =
      reportsData?.data?.map((report: any) => {
        let completion_status = "started";
        const statuses = [report.status, report.update_request_status] as string[];

        if (statuses.includes("needs-more-information")) {
          completion_status = "needs-more-information";
        } else if (report.nothing_to_report) {
          completion_status = "nothing-to-report";
        } else if (statuses.includes("awaiting-approval")) {
          completion_status = "awaiting-approval";
        } else if (report.status === "approved") {
          completion_status = "approved";
        } else if (report.status === "due") {
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

  const ModalsMapping = {
    ready_to_submit: {
      title: t("Are you sure you want to submit these reports?"),
      content: t("Sending these reports will forward all the information to WRI for review."),
      primaryButtonProps: {
        children: t("Submit Reports"),
        onClick: () => {
          submitReportingTask({ pathParams: { uuid: reportingTaskUUID } });
          closeModal();
        }
      },
      secondaryButtonProps: {
        children: t("Cancel"),
        onClick: closeModal
      }
    },

    has_mandatory: {
      title: t("Complete Mandatory Task"),
      content: t(
        "Please complete the mandatory task before submitting your reports. You won't be able to submit until it's done."
      ),
      primaryButtonProps: {
        children: t("Close"),
        onClick: () => closeModal()
      }
    },

    has_outstanding_tasks: {
      title: t("Are you sure you want to submit these reports? You currently have {count} outstanding reports", {
        count: reports.outstandingAdditionalCount
      }),
      content: t("Sending these reports will forward all the information to WRI for review."),
      primaryButtonProps: {
        children: t("Submit Reports"),
        onClick: () => {
          submitReportingTask({ pathParams: { uuid: reportingTaskUUID } });
          closeModal();
        }
      },
      secondaryButtonProps: {
        children: t("Cancel"),
        onClick: closeModal
      }
    }
  };

  const submitReportingTaskHandler = () => {
    let modalProps: any = ModalsMapping.ready_to_submit;
    if (reports.outstandingMandatoryCount > 0) {
      modalProps = ModalsMapping.has_mandatory;
    } else if (reports.outstandingAdditionalCount > 0) {
      modalProps = ModalsMapping.has_outstanding_tasks;
    }

    openModal(<Modal {...modalProps} iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }} />);
  };

  const nothingToReportHandler = (entity: ReportsModelNames, uuid: string) => {
    openModal(
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
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: closeModal
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
                <Button as={Link} href={`/entity/${record.type}s/edit/${record.uuid}?mode=provide-feedback-entity`}>
                  {t("Provide Feedback")}
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
    <LoadingContainer loading={isLoading}>
      <Head>
        <title>{title}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my-projects" },
          { title: project.name, path: `/project/${projectUUID}` },
          {
            title
          }
        ]}
      />
      <PageHeader
        className="h-[203px]"
        title={title}
        subtitles={[t("Due by {due_at}", { due_at: format(reportingTask?.due_at, "d MMMM, yyyy, HH:mm") })]}
        hasBackButton={false}
      >
        <Button id="submit-button" onClick={submitReportingTaskHandler}>
          {t("Submit Report")}
        </Button>
      </PageHeader>
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
  );
};

export default ReportingTaskPage;
