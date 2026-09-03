import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useEffect, useMemo } from "react";

import { DRAFT } from "@/constants/statuses";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";

import { useNurseriesSelectionActions, useNurseriesSelectionState } from "../NurseriesSelection.provider";
import { getSelectionApprovalLockReason } from "../nurseryIndex.utils";

const NurseriesIndexBulkBar = () => {
  const t = useT();
  const { selectedNurseries, selectedCount } = useNurseriesSelectionState();
  const { clearSelection } = useNurseriesSelectionActions();
  const { setBulkActionToolbarVisible } = useLayoutShell();
  const selectedNursery = selectedCount === 1 ? selectedNurseries[0] : undefined;
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: selectedNursery?.uuid ?? "",
    entityStatus: selectedNursery?.status ?? "draft",
    updateRequestStatus: selectedNursery?.updateRequestStatus ?? null,
    useInformationRequiredModal: true
  });
  const visible = selectedCount > 0;
  const approvalLockReason = useMemo(
    () => getSelectionApprovalLockReason(selectedNurseries),
    [selectedNurseries]
  );
  const hasApprovedOrPendingNursery = approvalLockReason != null;
  const isDeleteDisabled = useMemo(
    () => selectedNurseries.some(nursery => nursery.status !== DRAFT),
    [selectedNurseries]
  );
  const isEditDisabled = selectedCount !== 1;

  useEffect(() => {
    setBulkActionToolbarVisible(visible);
    return () => setBulkActionToolbarVisible(false);
  }, [setBulkActionToolbarVisible, visible]);

  const cancelAction = useMemo(
    () => ({
      children: t("Cancel"),
      onClick: clearSelection
    }),
    [clearSelection, t]
  );

  const deleteAction = useMemo<BulkToolbarAction>(
    () => ({
      id: "delete",
      tone: "danger",
      children: t("Delete"),
      disabled: isDeleteDisabled,
      onClick: () => {}
    }),
    [isDeleteDisabled, t]
  );

  const toolbarActions = useMemo<BulkToolbarAction[]>(
    () => [
      {
        id: "download",
        children: t("Download"),
        onClick: () => {}
      },
      {
        id: "edit",
        children: t("Edit"),
        disabled: isEditDisabled,
        onClick: () => handleEdit()
      }
    ],
    [handleEdit, isEditDisabled, t]
  );

  const primaryAction = useMemo(
    () => ({
      children: t("Submit"),
      disabled: hasApprovedOrPendingNursery,
      onClick: () => {}
    }),
    [hasApprovedOrPendingNursery, t]
  );

  const infoTooltip = useMemo(() => {
    const statusLine =
      approvalLockReason === "pending-approval"
        ? selectedCount === 1
          ? t("This profile has already been submitted for review")
          : t("One or more selected profiles have already been submitted for review")
        : approvalLockReason === "approved"
          ? selectedCount === 1
            ? t("This profile has already been approved")
            : t("One or more selected profiles have already been approved")
          : approvalLockReason === "mixed"
            ? t(
                "One or more selected profile can't be submitted because they are already approved or awaiting approval"
              )
            : null;
    const lines = [statusLine, isEditDisabled ? t("Select one nursery to edit it.") : null].filter(
      (line): line is string => line != null
    );

    if (lines.length === 0) return undefined;
    return <ToolbarInfoTooltipContent lines={lines} />;
  }, [approvalLockReason, isEditDisabled, selectedCount, t]);

  if (!visible) return null;

  return (
    <>
      {EditModals}
      <div aria-hidden className="h-24" />
      <Box position="fixed" zIndex="100" bottom={3} left={3} right={3}>
        <BulkActionToolbar
          selectedCount={selectedCount}
          cancelAction={cancelAction}
          deleteAction={deleteAction}
          actions={toolbarActions}
          primaryAction={primaryAction}
          infoTooltip={infoTooltip}
        />
      </Box>
    </>
  );
};

export default NurseriesIndexBulkBar;
