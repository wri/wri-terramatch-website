import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { deleteSite, indexSiteConnection } from "@/connections/Entity";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { useModalContext } from "@/context/modal.provider";
import { ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { Status } from "@/types/common";
import { Selected } from "@/types/connection";

import { ModalId } from "../Modal/ModalConst";

interface SitesTableProps {
  project: ProjectLightDto;
  hasAddButton?: boolean;
  onFetch?: (data: Selected<typeof indexSiteConnection>) => void;
  alwaysShowPagination?: boolean;
}

const SitesTable = ({ project, hasAddButton = true, onFetch, alwaysShowPagination = false }: SitesTableProps) => {
  const t = useT();
  const { format } = useDate();
  const { openModal, closeModal } = useModalContext();
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

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

            const statusProps = getActionCardStatusMapper(t)[value]!;
            return <StatusTableCell statusProps={statusProps as { status: Status; statusText: string }} />;
          }
        },
        {
          accessorKey: "updateRequestStatus",
          header: t("Change Request"),
          cell: props => {
            let value = props.getValue() as string;
            const statusProps = getActionCardStatusMapper(t)[value]!;

            if (value === "no-update") {
              return t("N/A");
            } else {
              return <StatusTableCell statusProps={statusProps as { status: Status; statusText: string }} />;
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
            const record = props.row.original as SiteLightDto & { site_reports_total?: number };

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
    <div>
      <ConnectionTable
        connection={indexSiteConnection}
        connectionProps={{ filter: { projectUuid: project.uuid } }}
        onFetch={data => {
          onFetch?.(data);
          // Check if there are active filters by looking at the query parameters
          const urlParams = new URLSearchParams(window.location.search);
          const hasSearch = urlParams.get("search");
          const hasStatus = urlParams.get("status");
          const hasUpdateRequestStatus = urlParams.get("update_request_status");
          setHasActiveFilters(!!(hasSearch || hasStatus || hasUpdateRequestStatus));
        }}
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
            options: getChangeRequestStatusOptions(t).filter(option => option.value !== "restoration-in-progress")
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
      {/* Show custom message when there are no results and filters are active */}
      {hasActiveFilters && (
        <div className="text-gray-500 py-8 text-center">
          <Text variant="text-light-subtitle-400">
            {t("No sites match your search criteria. Try adjusting your filters.")}
          </Text>
        </div>
      )}
    </div>
  );
};

export default SitesTable;
