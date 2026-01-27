import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { last } from "lodash";
import Link from "next/link";
import { useMemo } from "react";

import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { applicationsConnection } from "@/connections/Application";
import { ApplicationDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Status } from "@/types/common";

const ApplicationsTable = () => {
  const t = useT();

  const columns = useMemo(
    (): ColumnDef<ApplicationDto>[] => [
      {
        accessorKey: "fundingProgrammeName",
        header: "Application"
      },
      {
        accessorKey: "uuid",
        header: "Stage",
        cell: props => last(props.row.original.submissions)?.stageName
      },
      {
        accessorKey: "uuid",
        cell: props => {
          const status = last(props.row.original.submissions)?.status;
          const statusProps = status == null ? undefined : getActionCardStatusMapper(t)[status];
          if (statusProps == null) return null;

          return (
            <StatusPill status={statusProps.status as Status} className="w-fit">
              <Text variant="text-bold-caption-100" className="whitespace-nowrap">
                {statusProps.statusText}
              </Text>
            </StatusPill>
          );
        },
        header: "Status"
      },
      {
        accessorKey: "uuid",
        header: "",
        cell: props => (
          <ActionTableCell
            primaryButtonProps={{ as: Link, href: `/applications/${props.getValue()}`, children: t("View") }}
          />
        ),
        meta: { align: "right" },
        enableSorting: false
      }
    ],
    [t]
  );

  return (
    <div>
      <ConnectionTable connection={applicationsConnection} columns={columns} />
    </div>
  );
};

export default ApplicationsTable;
