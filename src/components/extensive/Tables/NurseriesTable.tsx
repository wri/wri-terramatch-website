import { useT } from "@transifex/react";
import Link from "next/link";
import { useEffect } from "react";

import Button from "@/components/elements/Button/Button";
import { ServerSideTable, useEntityIndexQueryParams } from "@/components/elements/ServerSideTable/ServerSideTable";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { deleteNursery, EntityIndexConnection, useNurseryIndex } from "@/connections/Entity";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { useModalContext } from "@/context/modal.provider";
import { NurseryLightDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

import { ModalId } from "../Modal/ModalConst";

interface NurseriesTableProps {
  project: ProjectLightDto;
  hasAddButton?: boolean;
  onFetch?: (data: EntityIndexConnection<NurseryLightDto>) => void;
  alwaysShowPagination?: boolean;
}

const NurseriesTable = ({
  project,
  onFetch,
  hasAddButton = true,
  alwaysShowPagination = false
}: NurseriesTableProps) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { queryParams, onQueryParamChange } = useEntityIndexQueryParams();

  const { format } = useDate();

  const nurseryIndexQueryParams = { filter: { projectUuid: project.uuid }, ...queryParams };
  const [isLoaded, nurseryIndex] = useNurseryIndex(nurseryIndexQueryParams);

  useEffect(() => {
    onFetch?.(nurseryIndex as EntityIndexConnection<NurseryLightDto>);
  }, [nurseryIndex, onFetch]);

  const handleDeleteNursery = (uuid: string) => {
    openModal(
      ModalId.CONFIRM_NURSERY_DELETION,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Nursery Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this Nursery?"
        )}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: () => {
            deleteNursery(uuid)
              .then(() => {
                nurseryIndex.refetch();
              })
              .finally(() => {
                closeModal(ModalId.CONFIRM_NURSERY_DELETION);
              });
          }
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: () => closeModal(ModalId.CONFIRM_NURSERY_DELETION)
        }}
      />
    );
  };

  return (
    <ServerSideTable
      meta={{
        last_page:
          nurseryIndex?.indexTotal && queryParams.pageSize
            ? Math.ceil(nurseryIndex?.indexTotal / queryParams.pageSize)
            : 1
      }}
      data={nurseryIndex.entities ?? []}
      isLoading={!isLoaded}
      onQueryParamChange={onQueryParamChange}
      columns={[
        {
          accessorKey: "name",
          header: t("Name")
        },
        {
          accessorKey: "status",
          header: t("Status"),
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
          accessorKey: "seedlingsGrownCount",
          enableSorting: false,
          header: t("No. seedlings")
        },
        {
          accessorKey: "createdAt",
          header: t("Date created"),
          cell: props => format(props.getValue() as string)
        },
        {
          accessorKey: "uuid",
          header: "",
          enableSorting: false,
          cell: props => {
            const record = props.row.original as any;

            return (
              <ActionTableCell
                primaryButtonProps={{
                  as: Link,
                  href: getEntityDetailPageLink("nurseries", props.getValue() as string),
                  children: t("View Nursery")
                }}
                hasDeleteButton={record.nurseryReportsTotal === 0}
                onDelete={() => handleDeleteNursery(props.getValue() as string)}
              />
            );
          }
        }
      ]}
      columnFilters={[
        { type: "search", accessorKey: "query", placeholder: t("Search") },
        {
          type: "dropDown",
          accessorKey: "status",
          label: t("Status"),
          options: getStatusOptions(t)
        },
        {
          type: "dropDown",
          accessorKey: "updateRequestStatus",
          label: t("Change Request"),
          options: getChangeRequestStatusOptions(t)
        }
      ]}
      alwaysShowPagination={alwaysShowPagination}
    >
      {hasAddButton && (
        <Button
          as={Link}
          href={`/entity/nurseries/create/${project.frameworkUuid}?parent_name=projects&parent_uuid=${project.uuid}`}
        >
          {t("Add Nursery")}
        </Button>
      )}
    </ServerSideTable>
  );
};

export default NurseriesTable;
