import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import {
  bulkDeleteUserAssociations,
  sendOrganisationInviteReminders,
  updateOrganisationUserStatuses
} from "@/connections/UserAssociation";
import { useLayoutShell } from "@/redesignComponents/Layout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import { showToast } from "@/redesignComponents/status/Toast/showToast";

import TeamMemberActionModal, { type TeamBulkMember, type TeamMemberAction } from "./TeamMemberActionModal";

type AssociationStatus = TeamBulkMember["associationStatus"];

// Statuses each action applies to. An action is shown when any selected member has one of them, and enabled only
// when every selected member has one of them.
const ACCEPT_STATUSES: AssociationStatus[] = ["requested", "rejected"];
const REJECT_STATUSES: AssociationStatus[] = ["requested"];
const REMOVE_STATUSES: AssociationStatus[] = ["approved", "rejected"];
const SEND_REMINDER_STATUSES: AssociationStatus[] = ["invited"];

type TeamBulkActionToolbarProps = {
  organisationUuid: string;
  selectedMembers: TeamBulkMember[];
  onCancel: () => void;
};

const TeamBulkActionToolbar: FC<TeamBulkActionToolbarProps> = ({ organisationUuid, selectedMembers, onCancel }) => {
  const t = useT();
  const { setSidebarCollapseDisabled } = useLayoutShell();
  const [modalAction, setModalAction] = useState<TeamMemberAction | null>(null);
  const isSubmittingRef = useRef(false);
  const selectedCount = selectedMembers.length;
  const visible = selectedCount > 0;

  const pendingMembers = useMemo(
    () => selectedMembers.filter(member => member.associationStatus === "requested"),
    [selectedMembers]
  );
  const approvedMembers = useMemo(
    () => selectedMembers.filter(member => member.associationStatus === "approved"),
    [selectedMembers]
  );
  const rejectedMembers = useMemo(
    () => selectedMembers.filter(member => member.associationStatus === "rejected"),
    [selectedMembers]
  );

  const selectedStatuses = Array.from(new Set(selectedMembers.map(member => member.associationStatus)));
  const isShown = (statuses: AssociationStatus[]) =>
    selectedMembers.some(member => statuses.includes(member.associationStatus));
  const isEnabled = (statuses: AssociationStatus[]) =>
    selectedCount > 0 && selectedMembers.every(member => statuses.includes(member.associationStatus));

  // A disabled action in a mixed selection explains itself with the mixed-selection message, but only when a blocking
  // status has an explanation for this action.
  const getMixedTooltip = (
    actionStatuses: AssociationStatus[],
    explainedStatuses: AssociationStatus[],
    mixedMessage: string
  ) => {
    if (selectedStatuses.length < 2) return undefined;
    const blockingStatuses = selectedStatuses.filter(status => !actionStatuses.includes(status));
    return blockingStatuses.some(status => explainedStatuses.includes(status)) ? mixedMessage : undefined;
  };

  useEffect(() => {
    setSidebarCollapseDisabled(visible);

    return () => {
      setSidebarCollapseDisabled(false);
    };
  }, [setSidebarCollapseDisabled, visible]);

  const handleSendReminders = async () => {
    const invitedIds = selectedMembers
      .filter(member => member.associationStatus === "invited")
      .map(member => member.id);
    if (isSubmittingRef.current || invitedIds.length === 0) return;

    isSubmittingRef.current = true;
    try {
      await sendOrganisationInviteReminders(organisationUuid, invitedIds);
      showToast({
        label: t("Reminder sent successfully"),
        type: "success",
        placement: "bottom",
        duration: 5000
      });
      onCancel();
    } catch {
      showToast({
        label: t("Unable to send the reminder. Please try again."),
        type: "error",
        placement: "bottom",
        duration: 5000
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const acceptAction: BulkToolbarAction = {
    id: "accept",
    children: t("Accept"),
    disabled: !isEnabled(ACCEPT_STATUSES),
    tooltip: getMixedTooltip(
      ACCEPT_STATUSES,
      ["invited", "approved"],
      t(
        "One or more selected users can’t be accepted because they have a pending invitation or are already accepted members of the organization."
      )
    ),
    onClick: () => setModalAction("approve")
  };
  const rejectAction: BulkToolbarAction = {
    id: "reject",
    tone: "danger",
    children: t("Reject"),
    disabled: !isEnabled(REJECT_STATUSES),
    tooltip: getMixedTooltip(
      REJECT_STATUSES,
      ["invited", "approved"],
      t(
        "One or more selected users can’t be rejected because they have a pending invitation or are already accepted members of the organization."
      )
    ),
    onClick: () => setModalAction("reject")
  };
  const sendReminderAction: BulkToolbarAction = {
    id: "sendReminder",
    children: t("Send Reminder"),
    disabled: !isEnabled(SEND_REMINDER_STATUSES),
    onClick: handleSendReminders
  };
  const removeAction: BulkToolbarAction = {
    id: "remove",
    tone: "danger",
    children: t("Remove"),
    disabled: !isEnabled(REMOVE_STATUSES),
    tooltip: getMixedTooltip(
      REMOVE_STATUSES,
      ["invited", "requested"],
      t(
        "One or more selected users can’t be removed because they have a pending invitation or a pending request to join the organization."
      )
    ),
    onClick: () => setModalAction("remove")
  };

  const actions = [
    ...(isShown(ACCEPT_STATUSES) ? [acceptAction] : []),
    ...(isShown(REJECT_STATUSES) ? [rejectAction] : []),
    ...(isShown(SEND_REMINDER_STATUSES) ? [sendReminderAction] : [])
  ];

  const modalMembers = useMemo(() => {
    if (modalAction === "approve") return [...pendingMembers, ...rejectedMembers];
    if (modalAction === "reject") return pendingMembers;
    if (modalAction === "remove") return [...approvedMembers, ...rejectedMembers];
    return [];
  }, [approvedMembers, modalAction, pendingMembers, rejectedMembers]);

  const handleConfirm = async () => {
    if (isSubmittingRef.current || modalAction == null) return;

    if (modalAction === "remove") {
      const approvedIds = approvedMembers.map(member => member.id);
      const rejectedIds = rejectedMembers.map(member => member.id);
      if (approvedIds.length === 0 && rejectedIds.length === 0) {
        setModalAction(null);
        onCancel();
        return;
      }

      if (organisationUuid === "") {
        setModalAction(null);
        onCancel();
        return;
      }

      isSubmittingRef.current = true;
      try {
        if (approvedIds.length > 0) {
          await updateOrganisationUserStatuses(organisationUuid, approvedIds, "rejected");
        }
        if (rejectedIds.length > 0) {
          await bulkDeleteUserAssociations(organisationUuid, rejectedIds, "organisations");
        }
        showToast({
          label: t("Team member removed"),
          type: "success",
          placement: "bottom",
          duration: 5000
        });
        setModalAction(null);
        onCancel();
      } catch {
        showToast({
          label: t("Unable to remove the selected team members from the Organization."),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
      } finally {
        isSubmittingRef.current = false;
      }
      return;
    }

    if (organisationUuid === "") {
      setModalAction(null);
      onCancel();
      return;
    }

    const memberIds = modalMembers.map(member => member.id);
    if (memberIds.length === 0) {
      setModalAction(null);
      return;
    }

    isSubmittingRef.current = true;
    try {
      await updateOrganisationUserStatuses(
        organisationUuid,
        memberIds,
        modalAction === "approve" ? "approved" : "rejected"
      );
      showToast({
        label: modalAction === "approve" ? t("Access request approved") : t("Access request rejected"),
        type: "success",
        placement: "bottom",
        duration: 5000
      });
      setModalAction(null);
      onCancel();
    } catch {
      showToast({
        label:
          modalAction === "approve"
            ? t("Unable to approve the selected team members.")
            : t("Unable to reject the selected team members."),
        type: "error",
        placement: "bottom",
        duration: 5000
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  if (!visible) return null;

  return (
    <>
      <BulkActionToolbar
        selectedCount={selectedCount}
        cancelAction={{ children: t("Cancel"), onClick: onCancel }}
        deleteAction={isShown(REMOVE_STATUSES) ? removeAction : undefined}
        actions={actions}
      />
      <TeamMemberActionModal
        action={modalAction}
        members={modalMembers}
        onClose={() => setModalAction(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default TeamBulkActionToolbar;
