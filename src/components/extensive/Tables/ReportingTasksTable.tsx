import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import ActionTableCell from "@/components/extensive/TableCells/ActionTableCell";
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
          cell: props => <StatusTableCell status={props.getValue() as string} />
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
          cell: props => <StatusTableCell status={props.getValue() as string} />
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
    "information-required": {
      status: "warning",
      statusText: t("Information Required")
    },
    "not-started": {
      status: "error",
      statusText: t("Due")
    },
    draft: {
      status: "edit",
      statusText: t("Draft")
    },
    approved: {
      status: "success",
      statusText: t("Approved")
    },
    "nothing-to-report": {
      status: "warning",
      statusText: t("Nothing Reported")
    },
    "pending-approval": {
      status: "success",
      statusText: t("Pending Approval")
    }
  };
};
