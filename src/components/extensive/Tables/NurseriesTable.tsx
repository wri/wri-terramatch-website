import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/elements/Button/Button";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { useModalContext } from "@/context/modal.provider";
import {
  GetV2ProjectsUUIDNurseriesResponse,
  useDeleteV2NurseriesUUID,
  useGetV2ProjectsUUIDNurseries
} from "@/generated/apiComponents";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

import { ModalId } from "../Modal/ModalConst";

interface NurseriesTableProps {
  project: ProjectLightDto;
  hasAddButton?: boolean;
  onFetch?: (data: GetV2ProjectsUUIDNurseriesResponse) => void;
}

const NurseriesTable = ({ project, onFetch, hasAddButton = true }: NurseriesTableProps) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const [queryParams, setQueryParams] = useState();

  const { format } = useDate();

  const {
    data: nurseries,
    isLoading,
    refetch
  } = useGetV2ProjectsUUIDNurseries(
    {
      pathParams: { uuid: project.uuid },
      queryParams
    },
    {
      keepPreviousData: true,
      onSuccess: onFetch
    }
  );

  const { mutate: deleteNursery } = useDeleteV2NurseriesUUID({
    onSuccess() {
      refetch();
    }
  });

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
            deleteNursery({ pathParams: { uuid } });
            closeModal(ModalId.CONFIRM_NURSERY_DELETION);
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
      meta={nurseries?.meta}
      data={nurseries?.data || []}
      isLoading={isLoading}
      onQueryParamChange={setQueryParams}
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
          accessorKey: "seedlings_grown_count",
          header: t("No. seedlings")
        },
        {
          accessorKey: "created_at",
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
                hasDeleteButton={record.nursery_reports_total === 0}
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
          accessorKey: "update_request_status",
          label: t("Change Request"),
          options: getChangeRequestStatusOptions(t)
        }
      ]}
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
