import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { GetV2ProjectsUUIDSitesResponse, useGetV2ProjectsUUIDTasks } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useGetReportingWindow } from "@/hooks/useGetReportingWindow";

interface ReportingTasksTableProps {
  projectUUID: string;
  reportingPeriod: "quarterly" | "bi-annually";
  onFetch?: (data: GetV2ProjectsUUIDSitesResponse) => void;
}

const ReportingTasksTable = ({ projectUUID, reportingPeriod, onFetch }: ReportingTasksTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [queryParams, setQueryParams] = useState();
  const { getReportingWindow } = useGetReportingWindow();

  const { data: reportingTasks, isLoading } = useGetV2ProjectsUUIDTasks(
    {
      pathParams: { uuid: projectUUID },
      queryParams: queryParams
    },
    {
      keepPreviousData: true,
      onSuccess: onFetch
    }
  );

  return (
    <ServerSideTable
      meta={reportingTasks?.meta}
      data={reportingTasks?.data || []}
      isLoading={isLoading}
      onQueryParamChange={setQueryParams}
      variant={VARIANT_TABLE_BORDER_ALL}
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
            const statusProps = SubmissionStatusMapping(t)?.[props.getValue() as string] || {};
            return <StatusTableCell statusProps={statusProps} />;
          }
        },
        {
          accessorKey: "due_at",
          header: t("Title"),
          enableSorting: false,
          cell: props => {
            const value = props.getValue() as string;
            return (
              <p className="text-14-light whitespace-nowrap">
                {t("Project Report") + ` ${getReportingWindow(value, reportingPeriod)}`}
              </p>
            );
          }
        },
        {
          accessorKey: "completion_status",
          header: t("Completion Status"),
          enableSorting: false,
          cell: props => {
            const statusProps = CompletionStatusMapping(t)?.[props.getValue() as string] || {};
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
    "not-started": {
      status: "error",
      statusText: t("Not started")
    },
    started: {
      status: "edit",
      statusText: t("Started")
    },
    completed: {
      status: "success",
      statusText: t("Completed")
    },
    "nothing-to-report": {
      status: "warning",
      statusText: t("Nothing Reported")
    }
  };
};

export const SubmissionStatusMapping = (t: typeof useT): any => {
  return {
    due: {
      status: "warning",
      statusText: t("Due")
    },
    overdue: {
      status: "error",
      statusText: t("Overdue")
    },
    complete: {
      status: "success",
      statusText: t("Completed")
    }
  };
};
