import { useT } from "@transifex/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import { EntityIndexConnection, EntityIndexConnectionProps, useSiteIndex } from "@/connections/Entity";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { useModalContext } from "@/context/modal.provider";
import { useDeleteV2SitesUUID } from "@/generated/apiComponents";
import { ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

import { ModalId } from "../Modal/ModalConst";

interface SitesTableProps {
  project: ProjectLightDto;
  hasAddButton?: boolean;
  onFetch?: (data: EntityIndexConnection<SiteLightDto>) => void;
}

const SitesTable = ({ project, hasAddButton = true, onFetch }: SitesTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [tableParams, setTableParams] = useState<EntityIndexConnectionProps>({});
  const { openModal, closeModal } = useModalContext();

  const siteIndexQueryParams = {
    filter: { projectUuid: project.uuid },
    ...tableParams
  };
  const [isLoaded, response] = useSiteIndex(siteIndexQueryParams as EntityIndexConnectionProps);

  useEffect(() => {
    onFetch?.(response as EntityIndexConnection<SiteLightDto>);
  }, [response, onFetch]);

  const { mutate: deleteSite } = useDeleteV2SitesUUID({
    onSuccess() {
      response.refetch();
    }
  });

  const handleDeleteSite = (uuid: string) => {
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
          onClick: () => {
            deleteSite({ pathParams: { uuid } });
            closeModal(ModalId.CONFIRM_SITE_DELETION);
          }
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: () => closeModal(ModalId.CONFIRM_SITE_DELETION)
        }}
      />
    );
  };

  return (
    <ServerSideTable
      meta={{
        last_page:
          response?.indexTotal && tableParams.pageSize ? Math.ceil(response?.indexTotal / tableParams.pageSize) : 1
      }}
      data={response.entities ?? []}
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
        } as any);
        // response.refetch();
      }}
      variant={VARIANT_TABLE_BORDER_ALL}
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
          accessorKey: "number_of_trees_planted",
          header: t("Trees planted")
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
        },
        {
          type: "button",
          accessorKey: "add_site",
          name: t("Add Site"),
          hide: !hasAddButton,
          as: Link,
          href: `/entity/sites/create/${project.frameworkUuid}?parent_name=projects&parent_uuid=${project.uuid}`
        }
      ]}
    ></ServerSideTable>
  );
};

export default SitesTable;
