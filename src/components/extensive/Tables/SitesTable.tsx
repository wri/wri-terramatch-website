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
  GetV2ProjectsUUIDSitesResponse,
  useDeleteV2SitesUUID,
  useGetV2ProjectsUUIDSites
} from "@/generated/apiComponents";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

interface SitesTableProps {
  project: any;
  hasAddButton?: boolean;
  onFetch?: (data: GetV2ProjectsUUIDSitesResponse) => void;
}

const SitesTable = ({ project, hasAddButton = true, onFetch }: SitesTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [queryParams, setQueryParams] = useState();
  const { openModal, closeModal } = useModalContext();

  const {
    data: sites,
    isLoading,
    refetch
  } = useGetV2ProjectsUUIDSites(
    {
      pathParams: { uuid: project.uuid },
      queryParams: queryParams
    },
    {
      keepPreviousData: true,
      onSuccess: onFetch
    }
  );

  const { mutate: deleteSite } = useDeleteV2SitesUUID({
    onSuccess() {
      refetch();
    }
  });

  const handleDeleteSite = (uuid: string) => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Site Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this site?"
        )}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: () => {
            deleteSite({ pathParams: { uuid } });
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: closeModal
        }}
      />
    );
  };

  return (
    <ServerSideTable
      meta={sites?.meta}
      data={sites?.data || []}
      isLoading={isLoading}
      onQueryParamChange={setQueryParams}
      columns={[
        {
          accessorKey: "name",
          header: t("Name")
        },
        {
          accessorKey: "control_site",
          header: t("Type"),
          cell: props => (props.getValue() ? t("Control Site") : t("Site")),
          enableSorting: false
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
          accessorKey: "number_of_trees_planted",
          header: t("Trees planted")
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
                  href: getEntityDetailPageLink("sites", props.getValue() as string),
                  children: t("View site")
                }}
                hasDeleteButton={record.site_reports_total === 0}
                onDelete={() => handleDeleteSite(props.getValue() as string)}
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
          href={`/entity/sites/create/${project.framework_uuid}?parent_name=projects&parent_uuid=${project.uuid}`}
        >
          {t("Add Site")}
        </Button>
      )}
    </ServerSideTable>
  );
};

export default SitesTable;
