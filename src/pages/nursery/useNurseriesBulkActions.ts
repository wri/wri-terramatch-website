import { useT } from "@transifex/react";
import { useCallback, useMemo, useState } from "react";

import { deleteNursery } from "@/connections/Entity";
import { entityExportAll, entityUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
import ApiSlice from "@/store/apiSlice";
import {
  closeEntityProgressToast,
  completeEntityProgressToast,
  ENTITY_TOAST_IDS,
  showEntityErrorToast,
  showEntityProgressToast
} from "@/utils/entityOperationToasts";
import Log from "@/utils/log";

import { useNurseriesSelectionActions } from "./NurseriesSelection.provider";
import type { NurseryIndexRow } from "./nurseryIndex.types";
import { groupNurseryUuidsByFramework } from "./nurseryIndex.utils";
import { isNurseryDeletable, isNurseryEditable, isNurserySubmittable } from "./nurseryIndexSubmit";

type UseNurseriesBulkActionsProps = {
  selectedNurseries: NurseryIndexRow[];
  onNurseriesChanged: () => void;
};

const updateNurseryStatus = async (nurseryUuid: string, status: "pending-approval") => {
  await entityUpdate.fetchAwait({
    pathParams: { entity: "nurseries", uuid: nurseryUuid },
    body: {
      data: {
        type: "nurseries",
        id: nurseryUuid,
        attributes: { status }
      }
    }
  });
};

const refreshTouchedNurseries = (nurseryUuids: string[]) => {
  ApiSlice.pruneCache("nurseries", nurseryUuids);
  ApiSlice.pruneIndex("nurseries", "");
  ApiSlice.pruneIndex("projects", "");
};

export const useNurseriesBulkActions = ({ selectedNurseries, onNurseriesChanged }: UseNurseriesBulkActionsProps) => {
  const t = useT();
  const { clearSelection } = useNurseriesSelectionActions();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const submittableNurseries = useMemo(() => selectedNurseries.filter(isNurserySubmittable), [selectedNurseries]);
  const deletableNurseries = useMemo(() => selectedNurseries.filter(isNurseryDeletable), [selectedNurseries]);
  const canEdit = selectedNurseries.length === 1 && isNurseryEditable(selectedNurseries[0]);
  const canSubmit = selectedNurseries.length > 0 && submittableNurseries.length === selectedNurseries.length;
  const canDelete = selectedNurseries.length > 0 && deletableNurseries.length === selectedNurseries.length;

  const handleDownload = useCallback(async () => {
    const grouped = groupNurseryUuidsByFramework(selectedNurseries);
    if (grouped.length === 0 || isDownloading) {
      return;
    }

    setIsDownloading(true);
    clearSelection();
    try {
      showEntityProgressToast(
        t,
        selectedNurseries.length === 1 ? t("Downloading nursery") : t("Downloading nurseries"),
        ENTITY_TOAST_IDS.downloading
      );
      for (const { frameworkKey, uuids } of grouped) {
        await entityExportAll.downloadFile({
          pathParams: { entity: "nurseries" },
          queryParams: { frameworkKey, uuids }
        });
      }
      completeEntityProgressToast(ENTITY_TOAST_IDS.downloading, t("Download Complete"));
    } catch (error) {
      Log.error("Failed to download selected nurseries", error);
      closeEntityProgressToast(ENTITY_TOAST_IDS.downloading);
      showEntityErrorToast(t("Error Downloading Nurseries"));
    } finally {
      setIsDownloading(false);
    }
  }, [clearSelection, isDownloading, selectedNurseries, t]);

  const handleDelete = useCallback(async () => {
    if (!canDelete || isUpdating) {
      return;
    }

    setIsUpdating(true);
    const deletedUuids: string[] = [];
    try {
      for (const nursery of deletableNurseries) {
        await deleteNursery(nursery.uuid);
        deletedUuids.push(nursery.uuid);
      }
      showToast({
        label: t("Nursery Profile(s) deleted"),
        type: "success",
        placement: "bottom",
        duration: 5000
      });
    } catch (error) {
      showToast({
        label: t("Failed to delete selected nurseries"),
        type: "error",
        placement: "bottom"
      });
      throw error;
    } finally {
      if (deletedUuids.length > 0) {
        refreshTouchedNurseries(deletedUuids);
        onNurseriesChanged();
      }
      setIsUpdating(false);
    }
  }, [canDelete, deletableNurseries, isUpdating, onNurseriesChanged, t]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isUpdating) {
      return;
    }

    setIsUpdating(true);
    const submittedUuids: string[] = [];
    try {
      for (const nursery of submittableNurseries) {
        await updateNurseryStatus(nursery.uuid, "pending-approval");
        submittedUuids.push(nursery.uuid);
      }
    } catch (error) {
      showToast({
        label: t("Failed to submit selected nurseries"),
        type: "error",
        placement: "bottom"
      });
      throw error;
    } finally {
      if (submittedUuids.length > 0) {
        refreshTouchedNurseries(submittedUuids);
        onNurseriesChanged();
      }
      setIsUpdating(false);
    }
  }, [canSubmit, isUpdating, onNurseriesChanged, submittableNurseries, t]);

  return {
    isDownloading,
    isUpdating,
    canEdit,
    canSubmit,
    canDelete,
    handleDownload,
    handleDelete,
    handleSubmit
  };
};
