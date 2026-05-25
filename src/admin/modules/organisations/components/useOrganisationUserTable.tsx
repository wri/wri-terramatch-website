import { useT } from "@transifex/react";
import { useCallback, useRef, useState } from "react";

import { MENU_ITEM_VARIANT_BLUE, MENU_ITEM_VARIANT_DISABLED } from "@/components/elements/MenuItem/MenuItemVariant";
import Text from "@/components/elements/Text/Text";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useOrgUserAssociationUpdate } from "@/connections/Organisation";
import { useOrganisationUserAssociations } from "@/connections/UserAssociation";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";

type UpdateType = "approve" | "reject";

export type OrganisationUserRow = UserAssociationDto & {
  lastLoggedInAt?: string | null;
};

export const statusMap: { [key: string]: string } = {
  requested: "pending",
  approved: "accepted",
  rejected: "rejected"
};

export const useOrganisationUserTable = (organisationUuid: string) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>("");
  const [updateType, setUpdateType] = useState<UpdateType | null>(null);
  const [loaded, { data: usersList, refetch }] = useOrganisationUserAssociations({
    organisationUuid
  });
  const [, { create, isCreating, createFailure }] = useOrgUserAssociationUpdate({
    organisationUuid,
    userUuid: selectedUserUuid
  });
  const createRef = useRef(create);
  createRef.current = create;

  const clearSelection = useCallback(() => {
    setSelectedUserUuid("");
    setUpdateType(null);
  }, []);

  const handleUpdateSuccess = useCallback(() => {
    refetch();
    closeModal(ModalId.CONFIRM_USER);
    if (updateType === "approve") {
      openNotification("success", t("Success!"), t("User approved successfully"));
    } else if (updateType === "reject") {
      openNotification("success", t("Success!"), t("User rejected successfully"));
    }
    clearSelection();
  }, [t, clearSelection, closeModal, openNotification, refetch, updateType]);

  useRequestSuccess(isCreating, createFailure, handleUpdateSuccess);

  const handleOpenModal = useCallback(
    (type: UpdateType, userUuid?: string) => {
      if (userUuid == null) return;

      setSelectedUserUuid(userUuid);
      setUpdateType(type);

      const title = type === "approve" ? t("Confirm User Approval") : t("Confirm User Rejection");
      const content =
        type === "approve"
          ? t(
              "Are you sure you want to approve this user's request to join your organization? Once approved, the user will be granted access to your organization's resources and will receive a notification confirming their acceptance. Please note that once approved, the user will have the same level of access as other members in your organization."
            )
          : t(
              "Are you sure you want to reject this user's request to join your organization? Once rejected, the user will be unable to access your organization's resources and will receive a notification confirming their rejection."
            );

      openModal(
        ModalId.CONFIRM_USER,
        <Modal
          title={title}
          content={content}
          primaryButtonProps={{
            children: type === "approve" ? t("Approve User") : t("Reject User"),
            onClick: () => {
              createRef.current({ status: type === "approve" ? "approved" : "rejected" });
            }
          }}
          secondaryButtonProps={{
            children: t("Cancel"),
            onClick: () => {
              closeModal(ModalId.CONFIRM_USER);
              clearSelection();
            }
          }}
        />
      );
    },
    [clearSelection, closeModal, openModal, t]
  );

  const tableItemMenu = useCallback(
    (user: UserAssociationDto) => [
      {
        id: "1",
        render: () => (
          <div className="flex items-center gap-2">
            <Text variant="text-12-bold" className="pr-3">
              {t("Accept")}
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
          <div className="flex items-center gap-2">
            <Text variant="text-12-bold" className="pr-3">
              {t("Reject")}
            </Text>
          </div>
        ),
        onClick: () => {
          if (user.status !== "rejected") {
            handleOpenModal("reject", user.uuid);
          }
        },
        MenuItemVariant: user.status === "rejected" ? MENU_ITEM_VARIANT_DISABLED : MENU_ITEM_VARIANT_BLUE
      }
    ],
    [handleOpenModal, t]
  );

  return {
    isLoading: !loaded,
    usersList: (usersList ?? []) as OrganisationUserRow[],
    tableItemMenu
  };
};
