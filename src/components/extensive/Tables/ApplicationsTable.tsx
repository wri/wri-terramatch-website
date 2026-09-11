import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { last } from "lodash";
import Link from "next/link";
import { useMemo } from "react";

import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import StatusTag from "@/components/elements/StatusTag/StatusTag";
import ActionTableCell from "@/components/extensive/TableCells/ActionTableCell";
import { applicationsConnection } from "@/connections/Application";
import { ApplicationDto } from "@/generated/v3/entityService/entityServiceSchemas";

const ApplicationsTable = () => {
  const t = useT();

  const columns = useMemo(
    (): ColumnDef<ApplicationDto>[] => [
      {
        accessorKey: "fundingProgrammeName",
        header: t("Application")
      },
      {
        accessorKey: "uuid",
        id: "stage",
        header: t("Stage"),
        cell: props => last(props.row.original.submissions)?.stageName
      },
      {
        accessorKey: "uuid",
        id: "status",
        cell: props => {
          const status = last(props.row.original.submissions)?.status;
          if (status == null) return null;

          return <StatusTag status={status} size="small" source="formSubmission" />;
        },
        header: t("Status")
      },
      {
        accessorKey: "uuid",
        id: "action",
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
