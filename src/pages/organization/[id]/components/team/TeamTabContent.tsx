import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import Modal from "@/components/extensive/Modal/Modal";
import Container from "@/components/generic/Layout/Container";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useModalContext } from "@/context/modal.provider";
import {
  useGetV2OrganisationsApprovedUsersUUID,
  useGetV2OrganisationsUserRequestsUUID,
  usePutV2OrganisationsApproveUser,
  usePutV2OrganisationsRejectUser
} from "@/generated/apiComponents";
import { UserRead } from "@/generated/apiSchemas";

import TeamMemberCard from "./TeamMemberCard";

const TeamTabContent = () => {
  const t = useT();

  const { query } = useRouter();
  const { openModal, closeModal } = useModalContext();

  // Queries
  const { data: approvedUsers, refetch: refetchApprovedUsers } = useGetV2OrganisationsApprovedUsersUUID<{
    data: UserRead[];
  }>({
    pathParams: {
      uuid: String(query.id)
    }
  });
  const { data: pendingUsers, refetch: refetchPendingUsers } = useGetV2OrganisationsUserRequestsUUID<{
    data: UserRead[];
  }>({
    pathParams: {
      uuid: String(query.id)
    }
  });

  // Mutations
  const { mutate: approveUser } = usePutV2OrganisationsApproveUser({
    onSuccess: () => {
      refetchApprovedUsers();
      refetchPendingUsers();
      closeModal();
    }
  });
  const { mutate: rejectUser } = usePutV2OrganisationsRejectUser({
    onSuccess: () => {
      refetchApprovedUsers();
      refetchPendingUsers();
      closeModal();
    }
  });

  /**
   * Conditionally render Approve or Reject Modal Content
   * @param type approve | reject
   * @param user UserRead
   * @returns openModal func
   */
  const handleOpenModal = (type: "approve" | "reject", user?: UserRead) => {
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
      <Modal
        title={title}
        content={content}
        primaryButtonProps={{
          children: type === "approve" ? t("Approve User") : t("Reject User"),
          onClick: () => {
            const actionBody = {
              organisation_uuid: query.id as string,
              // @ts-ignore
              user_uuid: user?.uuid
            };

            if (type === "approve") approveUser({ body: actionBody });
            else rejectUser({ body: actionBody });
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal()
        }}
      />
    );
  };

  return (
    <Container className="py-15">
      <LoadingContainer loading={false}>
        <Text variant="text-heading-2000">{t("Meet the Team")}</Text>

        <When condition={!!approvedUsers?.data.length}>
          <div className="mt-12 rounded-lg bg-neutral-150 px-14 py-8">
            <Text variant="text-heading-200">
              {t("Your Organizations' TerraMatch Users ({n})", { n: approvedUsers?.data.length })}
            </Text>
            <List
              className="mt-10 grid grid-cols-4 gap-6"
              items={approvedUsers?.data ?? []}
              render={user => <TeamMemberCard user={user} />}
            />
          </div>
        </When>
        <When condition={!!pendingUsers?.data.length}>
          <div className="mt-12 rounded-lg bg-neutral-150 px-14 py-8">
            <Text variant="text-heading-200">
              {t("Requests to Join Organization ({n})", { n: pendingUsers?.data.length })}
            </Text>
            <List
              className="mt-10 grid grid-cols-3 gap-6"
              items={pendingUsers?.data ?? []}
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
        </When>
      </LoadingContainer>
    </Container>
  );
};

export default TeamTabContent;
