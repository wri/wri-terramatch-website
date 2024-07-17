import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { useGetV2ProjectsUUIDTasks } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";

interface ReportingTasksTableProps {
  projectUUID: string;
}

const ReportingWindow = ({ dueDate }: { dueDate: string }) => {
  const t = useT();
  const window = useReportingWindow(dueDate);
  return <p className="text-14-light whitespace-nowrap">{t("Project Report {window}", { window })}</p>;
};

const ReportingTasksTable = ({ projectUUID }: ReportingTasksTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [queryParams, setQueryParams] = useState();

  const { data: reportingTasks, isLoading } = useGetV2ProjectsUUIDTasks(
    {
      pathParams: { uuid: projectUUID },
      queryParams: queryParams
    },
    {
      keepPreviousData: true,
      enabled: queryParams != null
    }
  );

  return (
    <ServerSideTable
      meta={reportingTasks?.meta}
      data={reportingTasks?.data ?? []}
      isLoading={isLoading}
      onQueryParamChange={setQueryParams}
      variant={VARIANT_TABLE_BORDER_ALL}
      initialTableState={{ sorting: [{ id: "due_at", desc: true }] }}
      columns={[
        {
          accessorKey: "due_at",
          header: t("Due date"),
          cell: props => format(props.getValue() as string)
        },
        {
          accessorKey: "status",
          header: t("Submission Status"),
          cell: props => {
            const statusProps = SubmissionStatusMapping(t)?.[props.getValue() as string] ?? {};
            return <StatusTableCell statusProps={statusProps} />;
          }
        },
        {
          id: "title",
          accessorKey: "due_at",
          header: t("Title"),
          enableSorting: false,
          cell: props => <ReportingWindow dueDate={props.getValue() as string} />
        },
        {
          accessorKey: "completion_status",
          header: t("Completion Status"),
          enableSorting: false,
          cell: props => {
            const statusProps = CompletionStatusMapping(t)?.[props.getValue() as string] ?? {};
            return <StatusTableCell statusProps={statusProps} />;
          }
        },
        {
          accessorKey: "uuid",
          header: "",
          enableSorting: false,
          cell: props => (
            <ActionTableCell
              primaryButtonProps={{
                as: Link,
                href: `/project/${projectUUID}/reporting-task/${props.getValue()}`,
                children: t("View")
              }}
            />
          )
        }
      ]}
    />
  );
};

export default ReportingTasksTable;

export const CompletionStatusMapping = (t: typeof useT): any => {
  return {
    "needs-more-information": {
      status: "warning",
      statusText: t("Needs More Information")
    },
    "not-started": {
      status: "error",
      statusText: t("Not started")
    },
    started: {
      status: "edit",
      statusText: t("Started")
    },
    approved: {
      status: "success",
      statusText: t("Approved")
    },
    "nothing-to-report": {
      status: "warning",
      statusText: t("Nothing Reported")
    },
    "awaiting-approval": {
      status: "success",
      statusText: t("Submitted for approval")
    }
  };
};

export const SubmissionStatusMapping = (t: typeof useT): any => {
  return {
    due: {
      status: "warning",
      statusText: t("Due")
    },
    "awaiting-approval": {
      status: "awaiting",
      statusText: t("Awaiting approval")
    },
    "needs-more-information": {
      status: "warning",
      statusText: t("Needs more information")
    },
    approved: {
      status: "success",
      statusText: t("Approved")
    }
  };
};
