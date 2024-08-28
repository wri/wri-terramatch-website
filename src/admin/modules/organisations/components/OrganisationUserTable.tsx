import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useT } from "@transifex/react";
import { useParams } from "react-router-dom";

import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import { MENU_ITEM_VARIANT_BLUE, MENU_ITEM_VARIANT_DISABLED } from "@/components/elements/MenuItem/MenuItemVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import {
  useGetV2AdminUsersUsersOrganisationListUUID,
  usePutV2OrganisationsApproveUser,
  usePutV2OrganisationsRejectUser
} from "@/generated/apiComponents";
import { V2PostOrganisationsApproveUserBody } from "@/generated/apiRequestBodies";
import { V2AdminUserRead } from "@/generated/apiSchemas";

const statusMap: { [key: string]: string } = {
  requested: "pending",
  approved: "accepted",
  rejected: "rejected"
};

const OrganisationUserTable = () => {
  const { id } = useParams<"id">();
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { data: usersList, refetch } = useGetV2AdminUsersUsersOrganisationListUUID({
    pathParams: {
      uuid: id as string
    }
  }) as any;

  const { mutate: approveUser } = usePutV2OrganisationsApproveUser({
    onSuccess: () => {
      refetch();
      closeModal(ModalId.CONFIRM_USER);
    }
  });
  const { mutate: rejectUser } = usePutV2OrganisationsRejectUser({
    onSuccess: () => {
      refetch();
      closeModal(ModalId.CONFIRM_USER);
    }
  });

  const tableItemMenu = (user: V2AdminUserRead) => [
    {
      id: "1",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => {}}>
          <Text variant="text-12-bold" className="pr-2">
            Accept
          </Text>
        </div>
      ),
      onClick: () => {
        handleOpenModal("approve", user.uuid);
      }
    },
    {
      id: "2",
      render: () => (
        <div className={`flex items-center gap-2`} onClick={() => {}}>
          <Text variant="text-12-bold" className="pr-2">
            Reject
          </Text>
        </div>
      ),
      onClick: () => {
        user.status === "rejected" ? () => {} : handleOpenModal("reject", user.uuid);
      },
      MenuItemVariant: user.status === "rejected" ? MENU_ITEM_VARIANT_DISABLED : MENU_ITEM_VARIANT_BLUE
    }
  ];

  const handleOpenModal = (type: "approve" | "reject", userUuid?: string) => {
    const title = type === "approve" ? t("Confirm User Approval") : t("Confirm User Rejection");
    const content =
      type === "approve"
        ? t(
            "Are you sure you want to approve this user's request to join your organization? Once approved, the user will be granted access to your organization's resources and will receive a notification confirming their acceptance. Please note that once approved, the user will have the same level of access as other members in your organization."
          )
        : t(
            "Are you sure you want to reject this user's request to join your organization? Once rejected, the user will be unable to access your organization's resources and will receive a notification confirming their rejection."
          );

    return openModal(
      ModalId.CONFIRM_USER,
      <Modal
        title={title}
        content={content}
        primaryButtonProps={{
          children: type === "approve" ? t("Approve User") : t("Reject User"),
          onClick: () => {
            const actionBody = {
              organisation_uuid: id as string,
              user_uuid: userUuid
            } as V2PostOrganisationsApproveUserBody;

            if (type === "approve") approveUser({ body: actionBody });
            else rejectUser({ body: actionBody });
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.CONFIRM_USER)
        }}
      />
    );
  };

  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Users
      </Typography>
      <DataGrid
        rows={usersList ?? []}
        columns={[
          {
            field: "first_name",
            headerName: "Name",
            flex: 1,
            sortable: true,
            filterable: false,
            renderCell: (user: any) => `${user.row.first_name} ${user.row.last_name}`,
            disableColumnMenu: true
          },
          {
            field: "email_address",
            headerName: "Email",
            flex: 1,
            sortable: true,
            filterable: false,
            disableColumnMenu: true
          },
          {
            field: "last_logged_in_at",
            headerName: "Last login date",
            flex: 1,
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (user: any) =>
              user.row.last_logged_in_at ? new Date(user.row.last_logged_in_at).toLocaleDateString("en-GB") : ""
          },
          {
            field: "status",
            headerName: "Status",
            flex: 1,
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (user: any) => statusMap[user.row.status]
          },
          {
            field: "",
            headerName: "",
            sortable: false,
            filterable: false,
            align: "center",
            disableColumnMenu: true,
            renderCell: params => {
              return (
                params.row.status !== "approved" && (
                  <Menu menu={tableItemMenu(params.row)} placement={MENU_PLACEMENT_RIGHT_BOTTOM}>
                    <div className="rounded p-1 hover:bg-primary-200">
                      <Icon
                        name={IconNames.ELIPSES}
                        className="roudn h-4 w-4 cursor-pointer rounded-sm text-grey-720 hover:bg-primary-200"
                      />
                    </div>
                  </Menu>
                )
              );
            },
            disableReorder: true
          }
        ]}
        getRowId={item => item.uuid || item.id || ""}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeader": {
            paddingX: 3
          },
          "& .MuiDataGrid-cell": {
            paddingX: 3
          }
        }}
        disableRowSelectionOnClick={true}
        disableColumnMenu={true}
        disableColumnSelector={true}
        disableColumnFilter={true}
        disableDensitySelector={true}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
      />
    </div>
  );
};

export default OrganisationUserTable;
