import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import { bulkDeleteUserAssociations, updateOrganisationUserStatuses } from "@/connections/UserAssociation";
import { useLayoutShell } from "@/redesignComponents/Layout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import { showToast } from "@/redesignComponents/status/Toast/showToast";

import TeamMemberActionModal, { type TeamBulkMember, type TeamMemberAction } from "./TeamMemberActionModal";

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

  const hasPendingMembers = pendingMembers.length > 0;
  const hasApprovedMembers = approvedMembers.length > 0;
  const hasRejectedMembers = rejectedMembers.length > 0;

  useEffect(() => {
    setSidebarCollapseDisabled(visible);

    return () => {
      setSidebarCollapseDisabled(false);
    };
  }, [setSidebarCollapseDisabled, visible]);

  const actions = useMemo<BulkToolbarAction[]>(
    () =>
      hasPendingMembers && (hasApprovedMembers || hasRejectedMembers)
        ? [{ id: "reject", tone: "danger", children: t("Reject"), onClick: () => setModalAction("reject") }]
        : [],
    [hasApprovedMembers, hasPendingMembers, hasRejectedMembers, t]
  );

  const destructiveAction = useMemo<BulkToolbarAction>(() => {
    if (hasApprovedMembers || hasRejectedMembers) {
      return {
        id: "remove",
        tone: "danger",
        children: t("Remove"),
        onClick: () => setModalAction("remove")
      };
    }

    return {
      id: "reject",
      tone: "danger",
      children: t("Reject"),
      onClick: () => setModalAction("reject")
    };
  }, [hasApprovedMembers, hasRejectedMembers, t]);

  const primaryAction = useMemo(
    () =>
      hasPendingMembers || hasRejectedMembers
        ? { children: t("Accept"), onClick: () => setModalAction("approve") }
        : undefined,
    [hasPendingMembers, hasRejectedMembers, t]
  );

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
        deleteAction={destructiveAction}
        actions={actions}
        primaryAction={primaryAction}
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
