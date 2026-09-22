import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import { bulkDeleteUserAssociations, updateOrganisationUserStatuses } from "@/connections/UserAssociation";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

import TeamMemberActionModal, { type TeamBulkMember, type TeamMemberAction } from "./TeamMemberActionModal";

type TeamBulkActionToolbarProps = {
  organisationUuid: string;
  selectedMembers: TeamBulkMember[];
  onCancel: () => void;
};

const TeamBulkActionToolbar: FC<TeamBulkActionToolbarProps> = ({ organisationUuid, selectedMembers, onCancel }) => {
  const t = useT();
  const isAdmin = useIsAdmin();
  const { isBulkActionToolbarVisible, setBulkActionToolbarVisible, setSidebarCollapseDisabled } = useLayoutShell();
  const [modalAction, setModalAction] = useState<TeamMemberAction | null>(null);
  const isSubmittingRef = useRef(false);
  const selectedCount = selectedMembers.length;
  const visible = selectedCount > 0;
  const pendingMembers = useMemo(
    () => selectedMembers.filter(member => member.associationStatus === "requested"),
    [selectedMembers]
  );
  const acceptedMembers = useMemo(
    () => selectedMembers.filter(member => member.associationStatus === "approved"),
    [selectedMembers]
  );
  const hasPendingMembers = pendingMembers.length > 0;
  const hasAcceptedMembers = acceptedMembers.length > 0;
  const isMixedSelection = hasPendingMembers && hasAcceptedMembers;

  useEffect(() => {
    setBulkActionToolbarVisible(visible);
    setSidebarCollapseDisabled(visible);

    return () => {
      setBulkActionToolbarVisible(false);
      setSidebarCollapseDisabled(false);
    };
  }, [setBulkActionToolbarVisible, setSidebarCollapseDisabled, visible]);

  const actions = useMemo<BulkToolbarAction[]>(
    () =>
      isMixedSelection
        ? [
            {
              id: "reject",
              tone: "danger" as const,
              children: t("Reject"),
              onClick: () => setModalAction("reject")
            }
          ]
        : [],
    [isMixedSelection, t]
  );

  const destructiveAction = useMemo<BulkToolbarAction>(
    () => ({
      id: hasAcceptedMembers ? "remove" : "reject",
      tone: "danger",
      children: hasAcceptedMembers ? t("Remove") : t("Reject"),
      onClick: () => setModalAction(hasAcceptedMembers ? "remove" : "reject")
    }),
    [hasAcceptedMembers, t]
  );

  const primaryAction = useMemo(() => {
    if (!hasPendingMembers) return undefined;

    return {
      children: t("Approve"),
      onClick: () => setModalAction("approve" as const)
    };
  }, [hasPendingMembers, t]);

  const modalMembers =
    modalAction === "approve" || modalAction === "reject"
      ? pendingMembers
      : modalAction === "remove"
      ? acceptedMembers
      : [];

  const handleConfirm = async () => {
    if (isSubmittingRef.current || modalAction == null) return;
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
      if (modalAction === "remove") {
        await bulkDeleteUserAssociations(organisationUuid, memberIds, "organisations");
      } else {
        await updateOrganisationUserStatuses(
          organisationUuid,
          memberIds,
          modalAction === "approve" ? "approved" : "rejected"
        );
      }
      setModalAction(null);
      onCancel();
    } catch {
      showToast({
        label:
          modalAction === "approve"
            ? t("Unable to approve the selected team members.")
            : modalAction === "reject"
            ? t("Unable to reject the selected team members.")
            : t("Unable to remove the selected team members from the Organization."),
        type: "error",
        placement: "bottom",
        duration: 5000
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  if (!isBulkActionToolbarVisible) return null;

  return (
    <>
      <Box position="fixed" zIndex="100" bottom={3} left={isAdmin ? 14 : 3} right={isAdmin ? 3 : 0}>
        <BulkActionToolbar
          selectedCount={selectedCount}
          cancelAction={{ children: t("Cancel"), onClick: onCancel }}
          deleteAction={destructiveAction}
          actions={actions}
          primaryAction={primaryAction}
        />
      </Box>
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
