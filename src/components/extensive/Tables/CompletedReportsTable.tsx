import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { FC, useCallback, useMemo } from "react";

import Button from "@/components/elements/Button/Button";
import { ConnectionTable, DataProcessorSortContext } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { indexNurseryReportConnection, indexSiteReportConnection } from "@/connections/Entity";
import { NurseryReportLightDto, SiteReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { singularEntityName } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { Status } from "@/types/common";
import { sortBySubmittedAt } from "@/utils/sort";

interface CompletedReportsTableProps {
  modelName: "nurseries" | "sites";
  modelUUID: string;
}

const SUBMITTED_AT_FIELD = "submittedAt";

/** Re-sorts current page by submittedAt with consistent null handling when backend returns inconsistent order */
const completedReportsDataProcessor = <T extends SiteReportLightDto | NurseryReportLightDto>(
  data: T[],
  sortContext: DataProcessorSortContext
): T[] => {
  if (sortContext.sortField !== SUBMITTED_AT_FIELD || data.length === 0) return data;
  const direction = sortContext.sortDirection ?? "ASC";
  return sortBySubmittedAt(data, direction);
};

const CompletedReportsTable: FC<CompletedReportsTableProps> = ({ modelName, modelUUID }) => {
  const t = useT();
  const { format } = useDate();

  const dataProcessor = useCallback(
    (data: (SiteReportLightDto | NurseryReportLightDto)[], sortContext: DataProcessorSortContext) =>
      completedReportsDataProcessor(data, sortContext),
    []
  );

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
            const value = props.getValue() as string | null | undefined;
            return value == null ? "" : format(value);
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
            const value = props.getValue() as string;
            const statusProps = getActionCardStatusMapper(t)[value];
            const status = statusProps?.status;
            const statusText = statusProps?.statusText;
            const propsForCell: { status: Status; statusText: string } | undefined =
              status != null && typeof statusText === "string" ? { status: status as Status, statusText } : undefined;
            return <StatusTableCell statusProps={propsForCell} />;
          }
        },
        {
          accessorKey: "updateRequestStatus",
          header: t("Change Request"),
          cell: props => {
            const value = props.getValue() as string;
            if (value === "no-update") return t("N/A");
            const statusProps = getActionCardStatusMapper(t)[value];
            const status = statusProps?.status;
            const statusText = statusProps?.statusText;
            const propsForCell: { status: Status; statusText: string } | undefined =
              status != null && typeof statusText === "string" ? { status: status as Status, statusText } : undefined;
            return <StatusTableCell statusProps={propsForCell} />;
          }
        },
        {
          accessorKey: "uuid",
          header: "",
          enableSorting: false,
          cell: props => (
            <Button
              as={Link}
              href={`/reports/${singularEntityName(modelName)}-report/${props.getValue()}`}
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
        dataProcessor={
          dataProcessor as (data: SiteReportLightDto[], sortContext: DataProcessorSortContext) => SiteReportLightDto[]
        }
      />
    );
  } else if (modelName === "nurseries") {
    return (
      <ConnectionTable
        connection={indexNurseryReportConnection}
        connectionProps={{ filter: { nurseryUuid: modelUUID } }}
        variant={VARIANT_TABLE_BORDER_ALL}
        columns={columns as ColumnDef<NurseryReportLightDto>[]}
        dataProcessor={
          dataProcessor as (
            data: NurseryReportLightDto[],
            sortContext: DataProcessorSortContext
          ) => NurseryReportLightDto[]
        }
      />
    );
  } else {
    throw new Error(`Invalid modelName: ${modelName}`);
  }
};

export default CompletedReportsTable;
