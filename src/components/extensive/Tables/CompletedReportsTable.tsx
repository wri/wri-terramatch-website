import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/elements/Button/Button";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { GetV2ENTITYUUIDReportsResponse, useGetV2ENTITYUUIDReports } from "@/generated/apiComponents";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { BaseModelNames } from "@/types/common";

interface CompletedReportsTableProps {
  modelName: BaseModelNames;
  modelUUID: string;
  onFetch?: (data: GetV2ENTITYUUIDReportsResponse) => void;
}

const CompletedReportsTable = ({ modelName, modelUUID, onFetch }: CompletedReportsTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [queryParams, setQueryParams] = useState();

  const { data: reports, isLoading } = useGetV2ENTITYUUIDReports(
    {
      pathParams: { entity: modelName, uuid: modelUUID },
      queryParams: queryParams
    },
    {
      keepPreviousData: true,
      onSuccess: onFetch
    }
  );

  return (
    <ServerSideTable
      meta={reports?.meta}
      data={reports?.data || []}
      isLoading={isLoading}
      onQueryParamChange={setQueryParams}
      variant={VARIANT_TABLE_BORDER_ALL}
      columns={[
        {
          accessorKey: "due_at",
          header: t("Due date"),
          cell: props => {
            return format(props.getValue() as string);
          }
        },
        {
          accessorKey: "submitted_at",
          header: t("Date submitted"),
          cell: props => {
            return format(props.getValue() as string);
          }
        },
        {
          accessorKey: "report_title",
          header: t("Report Title"),
          enableSorting: false,
          cell: props => {
            const report_title = props.getValue() as string;
            const title = props.row.original.title;

            return (
              <Text variant="text-14-light" className="whitespace-normal">
                {report_title ?? title}
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
          accessorKey: "update_request_status",
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
      ]}
    />
  );
};

export default CompletedReportsTable;
