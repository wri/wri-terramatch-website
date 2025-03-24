import { useT } from "@transifex/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { EntityIndexConnection, EntityIndexConnectionProps, useSiteReportIndex } from "@/connections/Entity";
import { SiteReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { BaseModelNames } from "@/types/common";

interface CompletedReportsTableProps {
  modelName: BaseModelNames;
  modelUUID: string;
  onFetch?: (data: EntityIndexConnection<SiteReportLightDto | any>) => void;
}

const CompletedReportsTable = ({ modelName, modelUUID, onFetch }: CompletedReportsTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [tableParams, setTableParams] = useState<EntityIndexConnectionProps>({});

  const statusActionsMap = {
    ["nurseries" as BaseModelNames]: {
      //commented out when nursery report is implemented
      // queryParam: { nurseryUuid: modelUUID },
      // hookReportIndex: useNurseryReportIndex
    },
    ["sites" as BaseModelNames]: {
      queryParam: { siteUuid: modelUUID },
      hookReportIndex: useSiteReportIndex
    }
  };

  const entityIndexQueryParams = {
    filter: statusActionsMap?.[modelName!]?.queryParam,
    ...tableParams
  };
  const hookReportIndex = statusActionsMap?.[modelName!]?.hookReportIndex;
  const [isLoaded, entityReportIndex] = hookReportIndex
    ? hookReportIndex(entityIndexQueryParams as EntityIndexConnectionProps)
    : [false, {} as EntityIndexConnection<SiteReportLightDto | any>];

  useEffect(() => {
    onFetch?.(entityReportIndex as EntityIndexConnection<SiteReportLightDto | any>);
  }, [entityReportIndex, onFetch]);

  return (
    <ServerSideTable
      meta={{
        last_page:
          entityReportIndex?.indexTotal && tableParams.pageSize
            ? Math.ceil(entityReportIndex?.indexTotal / tableParams.pageSize)
            : 1
      }}
      data={entityReportIndex?.entities || []}
      isLoading={!isLoaded}
      onQueryParamChange={param => {
        let sortDirection: EntityIndexConnectionProps["sortDirection"], sortField;
        if (param?.sort) {
          const startWithMinus = param?.sort.startsWith("-");
          sortDirection = startWithMinus ? "DESC" : "ASC";
          sortField = startWithMinus ? (param?.sort as string).substring(1, param?.sort?.length) : param?.sort;
        }
        setTableParams({
          pageNumber: param.page,
          pageSize: param.per_page,
          sortDirection,
          sortField
        } as EntityIndexConnectionProps);
      }}
      variant={VARIANT_TABLE_BORDER_ALL}
      columns={[
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
            const title = props.row.original.title;

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
      ]}
    />
  );
};

export default CompletedReportsTable;
