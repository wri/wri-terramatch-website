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

  // Each action applies to the whole selection: if any selected member is not eligible, the action is disabled.
  // Tooltip copy for the disabled state is pending design, so none is shown yet.
  const canAccept =
    selectedCount > 0 &&
    selectedMembers.every(
      member => member.associationStatus === "requested" || member.associationStatus === "rejected"
    );
  const canReject = selectedCount > 0 && selectedMembers.every(member => member.associationStatus === "requested");
  const canRemove =
    selectedCount > 0 &&
    selectedMembers.every(member => member.associationStatus === "approved" || member.associationStatus === "rejected");

  useEffect(() => {
    setSidebarCollapseDisabled(visible);

    return () => {
      setSidebarCollapseDisabled(false);
    };
  }, [setSidebarCollapseDisabled, visible]);

  const actions = useMemo<BulkToolbarAction[]>(
    () => [
      {
        id: "accept",
        children: t("Accept"),
        disabled: !canAccept,
        onClick: () => setModalAction("approve")
      },
      {
        id: "reject",
        tone: "danger",
        children: t("Reject"),
        disabled: !canReject,
        onClick: () => setModalAction("reject")
      }
    ],
    [canAccept, canReject, t]
  );

  const destructiveAction = useMemo<BulkToolbarAction>(
    () => ({
      id: "remove",
      tone: "danger",
      children: t("Remove"),
      disabled: !canRemove,
      onClick: () => setModalAction("remove")
    }),
    [canRemove, t]
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
        deleteAction={destructiveAction}
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
