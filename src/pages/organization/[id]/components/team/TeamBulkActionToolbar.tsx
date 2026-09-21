import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useState } from "react";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

import TeamMemberActionModal, { type TeamBulkMember, type TeamMemberAction } from "./TeamMemberActionModal";

type TeamBulkActionToolbarProps = {
  selectedMembers: TeamBulkMember[];
  onCancel: () => void;
};

const TeamBulkActionToolbar: FC<TeamBulkActionToolbarProps> = ({ selectedMembers, onCancel }) => {
  const t = useT();
  const isAdmin = useIsAdmin();
  const { isBulkActionToolbarVisible, setBulkActionToolbarVisible, setSidebarCollapseDisabled } = useLayoutShell();
  const [modalAction, setModalAction] = useState<TeamMemberAction | null>(null);
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
    if (hasPendingMembers) {
      return {
        children: t("Approve"),
        onClick: () => setModalAction("approve" as const)
      };
    }

    if (acceptedMembers.length === 1) {
      return {
        children: t("Edit"),
        onClick: () => {}
      };
    }

    return undefined;
  }, [acceptedMembers.length, hasPendingMembers, t]);

  const modalMembers =
    modalAction === "approve" || modalAction === "reject"
      ? pendingMembers
      : modalAction === "remove"
      ? acceptedMembers
      : [];

  const handleConfirm = () => {
    setModalAction(null);
    onCancel();
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
