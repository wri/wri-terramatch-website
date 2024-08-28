import { Typography } from "@mui/material";
import { useT } from "@transifex/react";
import { useParams } from "react-router-dom";

import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import { MENU_ITEM_VARIANT_BLUE, MENU_ITEM_VARIANT_DISABLED } from "@/components/elements/MenuItem/MenuItemVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_ORGANISATION } from "@/components/elements/Table/TableVariants";
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
          <Text variant="text-12-bold" className="pr-3">
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
          <Text variant="text-12-bold" className="pr-3">
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
      <Table
        variant={VARIANT_TABLE_ORGANISATION}
        hasPagination={true}
        classNameWrapper="max-h-[560px]"
        initialTableState={{
          pagination: { pageSize: 25, pageIndex: 0 }
        }}
        columns={[
          {
            accessorKey: "first_name",
            header: "Name",
            id: "name",
            cell: (user: any) => {
              return user?.row?.original.first_name + " " + user?.row?.original?.last_name;
            }
          },
          {
            accessorKey: "email_address",
            header: "Emai address",
            id: "email"
          },
          {
            accessorKey: "last_logged_in_at",
            header: "Last login date",
            id: "last_login",
            cell: user => {
              const lastLoggedIn = user?.row?.original?.last_logged_in_at;
              return lastLoggedIn ? new Date(lastLoggedIn).toLocaleDateString("en-GB") : "";
            }
          },
          {
            accessorKey: "status",
            header: "Status",
            id: "status",
            cell: user => statusMap[user?.row?.original?.status]
          },
          {
            accessorKey: "",
            header: "",
            id: "actions",
            cell: params =>
              params?.row?.original?.status !== "approved" && (
                <Menu menu={tableItemMenu(params?.row?.original)} placement={MENU_PLACEMENT_RIGHT_BOTTOM}>
                  <div className="rounded p-1 hover:bg-primary-200">
                    <Icon
                      name={IconNames.ELIPSES}
                      className="roudn h-4 w-4 cursor-pointer rounded-sm text-grey-720 hover:bg-primary-200"
                    />
                  </div>
                </Menu>
              )
          }
        ]}
        data={usersList ?? []}
      ></Table>
      <br />
    </div>
  );
};

export default OrganisationUserTable;
