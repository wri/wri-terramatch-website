import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import Intensity, { IntensityEnum } from "@/admin/modules/disturbanceReport/components/Intensity";
import Button from "@/components/elements/Button/Button";
import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { indexDisturbanceReportConnection } from "@/connections/Entity";
import { DisturbanceReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { Selected } from "@/types/connection";

interface DisturbanceReportsTableProps {
  projectUUID: string;
  onFetch?: (data: Selected<typeof indexDisturbanceReportConnection>) => void;
  alwaysShowPagination?: boolean;
}

const DisturbanceReportsTable = ({
  projectUUID,
  onFetch,
  alwaysShowPagination = false
}: DisturbanceReportsTableProps) => {
  const t = useT();
  const { format } = useDate();

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "dateOfDisturbance",
          header: t("Date of Disturbance"),
          cell: props => format(props.getValue() as string),
          enableSorting: false
        },
        {
          accessorKey: "status",
          header: t("Status"),
          cell: props => <StatusTableCell status={props.getValue() as string} />
        },
        {
          accessorKey: "updateRequestStatus",
          header: t("Change Request Status"),
          cell: props => {
            const value = props.getValue() as string;
            if (value == null || value === "" || value === "no-update") {
              return null;
            }
            return <StatusTableCell status={value} />;
          }
        },
        {
          accessorKey: "intensity",
          header: t("Intensity"),
          enableSorting: false,
          cell: props => {
            const intensity = props.getValue() as string;
            return <Intensity intensity={intensity?.toLowerCase() as IntensityEnum} />;
          }
        },
        {
          accessorKey: "uuid",
          header: "",
          enableSorting: false,
          cell: props => (
            <Button as={Link} href={`/reports/disturbance-report/${props.getValue()}`} className="float-right">
              {t("View")}
            </Button>
          )
        }
      ] as ColumnDef<DisturbanceReportLightDto>[],
    [format, t]
  );

  return (
    <ConnectionTable
      connection={indexDisturbanceReportConnection}
      connectionProps={{ filter: { projectUuid: projectUUID } }}
      onFetch={onFetch}
      variant={VARIANT_TABLE_BORDER_ALL}
      initialTableState={{ sorting: [{ id: "id", desc: true }] }}
      columns={columns}
      alwaysShowPagination={alwaysShowPagination}
    />
  );
};

export default DisturbanceReportsTable;

export const DisturbanceStatusMapping = (t: typeof useT): any => {
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
