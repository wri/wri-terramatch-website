import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useRef, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Container from "@/components/generic/Layout/Container";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useOrgUserAssociationUpdate } from "@/connections/Organisation";
import { useOrganisationUserAssociations } from "@/connections/UserAssociation";
import { useModalContext } from "@/context/modal.provider";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";

import InviteTeamMemberModal from "../InviteTeamMemberModal";
import TeamMemberCard from "./TeamMemberCard";

const TeamTabContent: FC = () => {
  const t = useT();

  const { query } = useRouter();
  const { openModal, closeModal } = useModalContext();
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>("");

  const [, { data: approvedUsers, refetch: refetchApproved }] = useOrganisationUserAssociations({
    organisationUuid: String(query.id),
    status: "approved"
  });

  const [, { data: pendingUsers, refetch: refetchPending }] = useOrganisationUserAssociations({
    organisationUuid: String(query.id),
    status: "requested"
  });

  const [, { create, isCreating, createFailure }] = useOrgUserAssociationUpdate({
    organisationUuid: query.id as string,
    userUuid: selectedUserUuid
  });
  const createRef = useRef(create);
  createRef.current = create;

  const handleUpdateSuccess = useCallback(() => {
    refetchApproved();
    refetchPending();
    closeModal(ModalId.CONFIRM_USER);
    setSelectedUserUuid("");
  }, [refetchApproved, refetchPending, closeModal]);

  useRequestSuccess(isCreating, createFailure, handleUpdateSuccess);

  /**
   * Conditionally render Approve or Reject Modal Content
   * @param type approve | reject
   * @param user UserAssociationDto
   */
  const handleOpenModal = (type: "approve" | "reject", user?: UserAssociationDto) => {
    if (user?.uuid == null) return;

    setSelectedUserUuid(user.uuid);

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
            // createRef.current is always the latest create fn (updated each render)
            const status = type === "approve" ? "approved" : "rejected";
            (createRef.current as (attributes: { status: "approved" | "rejected" }) => void)({
              status
            });
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => {
            closeModal(ModalId.CONFIRM_USER);
            setSelectedUserUuid("");
          }
        }}
      />
    );
  };

  const handleInvite = () => {
    openModal(
      ModalId.INVITE_MONITORING_PARTNER_MODAL,
      <InviteTeamMemberModal organisationUUID={query.id as string} onSuccess={() => {}} />
    );
  };

  return (
    <Container className="py-15">
      <LoadingContainer loading={false}>
        <Text variant="text-heading-2000">{t("Meet the Team")}</Text>

        {(approvedUsers?.length ?? 0) > 0 && (
          <div className="mt-12 rounded-lg bg-neutral-150 py-8 px-14">
            <div className="flex items-center justify-between">
              <Text variant="text-heading-200">
                {t("Your Organizations' TerraMatch Users ({n})", { n: approvedUsers?.length })}
              </Text>
              <Button onClick={handleInvite}>{t("add Team Member")}</Button>
            </div>

            <List
              className="mt-10 grid grid-cols-4 gap-6"
              items={approvedUsers ?? []}
              render={user => <TeamMemberCard user={user} />}
            />
          </div>
        )}

        {(pendingUsers?.length ?? 0) > 0 && (
          <div className="mt-12 rounded-lg bg-neutral-150 py-8 px-14">
            <Text variant="text-heading-200">
              {t("Requests to Join Organization ({n})", { n: pendingUsers?.length })}
            </Text>
            <List
              className="mt-10 grid grid-cols-3 gap-6"
              items={pendingUsers ?? []}
              render={user => (
                <TeamMemberCard
                  type="pending"
                  user={user}
                  onApprove={user => handleOpenModal("approve", user)}
                  onReject={user => handleOpenModal("reject", user)}
                />
              )}
            />
          </div>
        )}
      </LoadingContainer>
    </Container>
  );
};

export default TeamTabContent;
