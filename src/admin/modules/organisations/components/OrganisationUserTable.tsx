import { Typography } from "@mui/material";
import { useMemo } from "react";
import { useShowContext } from "react-admin";
import { useParams } from "react-router-dom";

import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_ORGANISATION } from "@/components/elements/Table/TableVariants";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";

import { OrganisationUserRow, statusMap, useOrganisationUserTable } from "./useOrganisationUserTable";

const OrganisationUserTable = () => {
  const { id } = useParams<"id">();
  const ctx = useShowContext();
  const orgId = ctx?.record.organisation ? ctx?.record.organisation?.uuid : (id as string);
  const { isLoading, usersList, tableItemMenu } = useOrganisationUserTable(orgId);

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        id: "name"
      },
      {
        accessorKey: "emailAddress",
        header: "Email address",
        id: "email"
      },
      {
        accessorKey: "lastLoggedInAt",
        header: "Last login date",
        id: "last_login",
        cell: (user: { row?: { original?: OrganisationUserRow } }) => {
          const lastLoggedIn = user?.row?.original?.lastLoggedInAt;
          return lastLoggedIn != null ? new Date(lastLoggedIn).toLocaleDateString("en-GB") : "";
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        id: "status",
        cell: (user: { row?: { original?: UserAssociationDto } }) => statusMap[user?.row?.original?.status ?? ""]
      },
      {
        accessorKey: "",
        header: "",
        id: "actions",
        cell: (params: { row?: { original?: UserAssociationDto } }) =>
          params?.row?.original?.status !== "approved" &&
          !isLoading && (
            <Menu
              menu={tableItemMenu(params?.row?.original as UserAssociationDto)}
              placement={MENU_PLACEMENT_RIGHT_BOTTOM}
            >
              <div className="rounded p-1 hover:bg-primary-200">
                <Icon
                  name={IconNames.ELIPSES}
                  className="roudn h-4 w-4 cursor-pointer rounded-sm text-grey-720 hover:bg-primary-200"
                />
              </div>
            </Menu>
          )
      }
    ],
    [isLoading, tableItemMenu]
  );

  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Users
      </Typography>
      <Table
        variant={VARIANT_TABLE_ORGANISATION}
        hasPagination={true}
        classNameWrapper="max-h-[560px]"
        initialTableState={{
          pagination: { pageSize: 50, pageIndex: 0 }
        }}
        columns={columns}
        data={usersList ?? []}
      ></Table>
      <br />
    </div>
  );
};

export default OrganisationUserTable;
