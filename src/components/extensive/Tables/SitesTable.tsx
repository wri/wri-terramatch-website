import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useCallback, useMemo } from "react";

import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { deleteSite, EntityIndexConnection, indexSiteConnection } from "@/connections/Entity";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { useModalContext } from "@/context/modal.provider";
import { ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

import { ModalId } from "../Modal/ModalConst";

interface SitesTableProps {
  project: ProjectLightDto;
  hasAddButton?: boolean;
  onFetch?: (data: EntityIndexConnection<SiteLightDto>) => void;
  alwaysShowPagination?: boolean;
}

const SitesTable = ({ project, hasAddButton = true, onFetch, alwaysShowPagination = false }: SitesTableProps) => {
  const t = useT();
  const { format } = useDate();
  const { openModal, closeModal } = useModalContext();

  const handleDeleteSite = useCallback(
    (uuid: string) => {
      openModal(
        ModalId.CONFIRM_SITE_DELETION,
        <Modal
          iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
          title={t("Confirm Site Deletion")}
          content={t(
            "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this site?"
          )}
          primaryButtonProps={{
            children: t("Yes"),
            onClick: async () => {
              await deleteSite(uuid);
              closeModal(ModalId.CONFIRM_SITE_DELETION);
            }
          }}
          secondaryButtonProps={{
            children: t("No"),
            onClick: () => closeModal(ModalId.CONFIRM_SITE_DELETION)
          }}
        />
      );
    },
    [closeModal, openModal, t]
  );

  const columns = useMemo(
    () =>
      [
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
          accessorKey: "treesPlantedCount",
          header: t("Trees planted"),
          enableSorting: false
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
                  href: getEntityDetailPageLink("sites", props.getValue() as string),
                  children: t("View site")
                }}
                hasDeleteButton={record.site_reports_total === 0}
                onDelete={() => handleDeleteSite(props.getValue() as string)}
              />
            );
          }
        }
      ] as ColumnDef<SiteLightDto>[],
    [format, handleDeleteSite, t]
  );

  return (
    <ConnectionTable
      connection={indexSiteConnection}
      connectionProps={{ filter: { projectUuid: project.uuid } }}
      dataProp="entities"
      totalProp="indexTotal"
      onFetch={onFetch}
      variant={VARIANT_TABLE_BORDER_ALL}
      columns={columns}
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
        },
        {
          type: "button",
          accessorKey: "add_site",
          name: t("Add Site"),
          hide: !hasAddButton,
          as: Link,
          href: `/entity/sites/create/${project.frameworkKey}?parent_name=projects&parent_uuid=${project.uuid}`
        }
      ]}
      alwaysShowPagination={alwaysShowPagination}
    />
  );
};

export default SitesTable;
