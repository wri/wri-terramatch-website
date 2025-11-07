import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { useLightProject } from "@/connections/Entity";
import { taskIndexConnection } from "@/connections/Task";
import FrameworkProvider, { useFrameworkContext } from "@/context/framework.provider";
import { TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { Selected } from "@/types/connection";

interface ReportingTasksTableProps {
  projectUUID: string;
  onFetch?: (data: Selected<typeof taskIndexConnection>) => void;
  alwaysShowPagination?: boolean;
}

const ReportingWindow = ({ dueDate }: { dueDate: string }) => {
  const t = useT();
  const { framework } = useFrameworkContext();
  const window = useReportingWindow(framework, dueDate);
  return <p className="text-14-light whitespace-nowrap">{t("Project Report {window}", { window })}</p>;
};

const ReportingTasksTable = ({ projectUUID, onFetch, alwaysShowPagination = false }: ReportingTasksTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [, { data: project }] = useLightProject({ id: projectUUID });

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "dueAt",
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
          accessorKey: "dueAt",
          header: t("Title"),
          enableSorting: false,
          cell: props => <ReportingWindow dueDate={props.getValue() as string} />
        },
        {
          accessorKey: "completionStatus",
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
      ] as ColumnDef<TaskLightDto>[],
    [format, projectUUID, t]
  );

  return (
    <FrameworkProvider frameworkKey={project?.frameworkKey}>
      <ConnectionTable
        connection={taskIndexConnection}
        connectionProps={{ filter: { projectUuid: projectUUID } }}
        onFetch={onFetch}
        variant={VARIANT_TABLE_BORDER_ALL}
        initialTableState={{ sorting: [{ id: "dueAt", desc: true }] }}
        columns={columns}
        alwaysShowPagination={alwaysShowPagination}
      />
    </FrameworkProvider>
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
