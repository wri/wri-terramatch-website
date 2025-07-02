import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { FC, useMemo } from "react";

import Button from "@/components/elements/Button/Button";
import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { indexNurseryReportConnection, indexSiteReportConnection } from "@/connections/Entity";
import { NurseryReportLightDto, SiteReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

interface CompletedReportsTableProps {
  modelName: "nurseries" | "sites";
  modelUUID: string;
}

const CompletedReportsTable: FC<CompletedReportsTableProps> = ({ modelName, modelUUID }) => {
  const t = useT();
  const { format } = useDate();

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "dueAt",
          header: t("Due date"),
          cell: props => {
            return format(props.getValue() as string);
          }
        },
        {
          accessorKey: "submittedAt",
          header: t("Date submitted"),
          cell: props => {
            return format(props.getValue() as string);
          }
        },
        {
          accessorKey: "reportTitle",
          header: t("Report Title"),
          enableSorting: false,
          cell: props => {
            const reportTitle = props.getValue() as string;
            const title = modelName === "nurseries" ? (props.row.original as NurseryReportLightDto).title : undefined;

            return (
              <Text variant="text-14-light" className="whitespace-normal">
                {reportTitle ?? title}
              </Text>
            );
          }
        },
        {
          accessorKey: "status",
          header: t("Completion Status"),
          cell: props => {
            let value = props.getValue() as string;

            const statusProps = getActionCardStatusMapper(t)[value] as any;
            return <StatusTableCell statusProps={statusProps} />;
          }
        },
        {
          accessorKey: "updateRequestStatus",
          header: t("Change Request"),
          cell: props => {
            let value = props.getValue() as string;
            const statusProps = getActionCardStatusMapper(t)[value] as any;

            if (value === "no-update") {
              return t("N/A");
            } else {
              return <StatusTableCell statusProps={statusProps} />;
            }
          }
        },
        {
          accessorKey: "uuid",
          header: "",
          enableSorting: false,
          cell: props => (
            <Button
              as={Link}
              href={`/reports/${pluralEntityNameToSingular(modelName)}-report/${props.getValue()}`}
              className="float-right"
            >
              {t("View Report")}
            </Button>
          )
        }
      ] as ColumnDef<SiteReportLightDto | NurseryReportLightDto>[],
    [format, modelName, t]
  );

  if (modelName === "sites") {
    return (
      <ConnectionTable
        connection={indexSiteReportConnection}
        connectionProps={{ filter: { siteUuid: modelUUID } }}
        variant={VARIANT_TABLE_BORDER_ALL}
        columns={columns as ColumnDef<SiteReportLightDto>[]}
      />
    );
  } else if (modelName === "nurseries") {
    return (
      <ConnectionTable
        connection={indexNurseryReportConnection}
        connectionProps={{ filter: { nurseryUuid: modelUUID } }}
        variant={VARIANT_TABLE_BORDER_ALL}
        columns={columns as ColumnDef<NurseryReportLightDto>[]}
      />
    );
  } else {
    throw new Error(`Invalid modelName: ${modelName}`);
  }
};

export default CompletedReportsTable;
