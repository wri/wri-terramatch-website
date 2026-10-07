import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { deleteNursery } from "@/connections/Entity";
import { entityExportAll, entityUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { getEntityEditPageLink } from "@/helpers/entity";
import ApiSlice from "@/store/apiSlice";
import {
  closeEntityProgressToast,
  completeEntityProgressToast,
  ENTITY_TOAST_IDS,
  showEntityErrorToast,
  showEntityProgressToast
} from "@/utils/entityOperationToasts";
import Log from "@/utils/log";

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

export const useNurseriesBulkActions = ({ selectedNurseries, onNurseriesChanged }: UseNurseriesBulkActionsProps) => {
  const t = useT();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const submittableNurseries = useMemo(() => selectedNurseries.filter(isNurserySubmittable), [selectedNurseries]);
  const deletableNurseries = useMemo(() => selectedNurseries.filter(isNurseryDeletable), [selectedNurseries]);
  const canEdit = selectedNurseries.length === 1 && isNurseryEditable(selectedNurseries[0]);
  const canSubmit = selectedNurseries.length > 0 && submittableNurseries.length === selectedNurseries.length;
  const canDelete = selectedNurseries.length > 0 && deletableNurseries.length === selectedNurseries.length;

  const refreshTouchedNurseries = useCallback(async (nurseryUuids: string[]) => {
    ApiSlice.pruneCache("nurseries", nurseryUuids);
    ApiSlice.pruneIndex("nurseries", "");
    ApiSlice.pruneIndex("projects", "");
  }, []);

  const handleDownload = useCallback(async () => {
    const grouped = groupNurseryUuidsByFramework(selectedNurseries);
    if (grouped.length === 0 || isDownloading) {
      return;
    }

    setIsDownloading(true);
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
  }, [isDownloading, selectedNurseries, t]);

  const handleEdit = useCallback(() => {
    if (!canEdit) {
      return;
    }
    void router.push(getEntityEditPageLink("nurseries", selectedNurseries[0].uuid));
  }, [canEdit, router, selectedNurseries]);

  const handleDelete = useCallback(async () => {
    if (!canDelete || isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      for (const nursery of deletableNurseries) {
        await deleteNursery(nursery.uuid);
      }
      await refreshTouchedNurseries(deletableNurseries.map(nursery => nursery.uuid));
      onNurseriesChanged();
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
      setIsUpdating(false);
    }
  }, [canDelete, deletableNurseries, isUpdating, onNurseriesChanged, refreshTouchedNurseries, t]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      for (const nursery of submittableNurseries) {
        await updateNurseryStatus(nursery.uuid, "pending-approval");
      }
      await refreshTouchedNurseries(submittableNurseries.map(nursery => nursery.uuid));
      onNurseriesChanged();
    } catch (error) {
      showToast({
        label: t("Failed to submit selected nurseries"),
        type: "error",
        placement: "bottom"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [canSubmit, isUpdating, onNurseriesChanged, refreshTouchedNurseries, submittableNurseries, t]);

  return {
    isDownloading,
    isUpdating,
    canEdit,
    canSubmit,
    canDelete,
    handleDownload,
    handleEdit,
    handleDelete,
    handleSubmit
  };
};
