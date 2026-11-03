import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { deleteSite } from "@/connections/Entity";
import { entityExportAll, entityUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { getEntityEditPageLink } from "@/helpers/entity";
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

import type { SiteIndexSite } from "./siteIndex.types";
import { groupSiteUuidsByFramework } from "./siteIndex.utils";
import { useSiteIndexSelectionActions } from "./SiteIndexSelection.provider";
import { isSiteDeletable, isSiteEditable, isSiteSubmittable } from "./siteIndexSubmit";

type UseSiteIndexBulkActionsProps = {
  selectedSites: SiteIndexSite[];
  /** True once a selected site has been checked as complete against its form. */
  isSubmissionReady: (site: SiteIndexSite) => boolean;
  onSitesChanged: () => void;
};

const updateSiteStatus = async (siteUuid: string, status: "pending-approval") => {
  await entityUpdate.fetchAwait({
    pathParams: { entity: "sites", uuid: siteUuid },
    body: {
      data: {
        type: "sites",
        id: siteUuid,
        attributes: { status }
      }
    }
  });
};

const refreshTouchedSites = (siteUuids: string[]) => {
  ApiSlice.pruneCache("sites", siteUuids);
  ApiSlice.pruneIndex("sites", "");
  ApiSlice.pruneIndex("projects", "");
};

export const useSiteIndexBulkActions = ({
  selectedSites,
  isSubmissionReady,
  onSitesChanged
}: UseSiteIndexBulkActionsProps) => {
  const t = useT();
  const router = useRouter();
  const { clearSelection } = useSiteIndexSelectionActions();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const submittableSites = useMemo(
    () => selectedSites.filter(site => isSiteSubmittable(site) && isSubmissionReady(site)),
    [isSubmissionReady, selectedSites]
  );
  const deletableSites = useMemo(() => selectedSites.filter(isSiteDeletable), [selectedSites]);
  const canEdit = selectedSites.length === 1 && isSiteEditable(selectedSites[0]);
  const canSubmit = selectedSites.length > 0 && submittableSites.length === selectedSites.length;
  const canDelete = selectedSites.length > 0 && deletableSites.length === selectedSites.length;

  const handleDownload = useCallback(async () => {
    const grouped = groupSiteUuidsByFramework(selectedSites);
    if (grouped.length === 0 || isDownloading) {
      return;
    }

    setIsDownloading(true);
    clearSelection();
    try {
      showEntityProgressToast(
        t,
        selectedSites.length === 1 ? t("Downloading site profile") : t("Downloading site profiles"),
        ENTITY_TOAST_IDS.downloading
      );
      for (const { frameworkKey, uuids } of grouped) {
        await entityExportAll.downloadFile({
          pathParams: { entity: "sites" },
          queryParams: { frameworkKey, uuids }
        });
      }
      completeEntityProgressToast(ENTITY_TOAST_IDS.downloading, t("Download Complete"));
    } catch (error) {
      Log.error("Failed to download selected sites", error);
      closeEntityProgressToast(ENTITY_TOAST_IDS.downloading);
      showEntityErrorToast(t("Error Downloading Sites"));
    } finally {
      setIsDownloading(false);
    }
  }, [clearSelection, isDownloading, selectedSites, t]);

  const handleEdit = useCallback(() => {
    if (!canEdit) {
      return;
    }
    void router.push(getEntityEditPageLink("sites", selectedSites[0].id));
  }, [canEdit, router, selectedSites]);

  const handleDelete = useCallback(async () => {
    if (!canDelete || isUpdating) {
      return;
    }

    setIsUpdating(true);
    const deletedUuids: string[] = [];
    try {
      for (const site of deletableSites) {
        await deleteSite(site.id);
        deletedUuids.push(site.id);
      }
      showToast({
        label: t("Site Profile(s) deleted"),
        type: "success",
        placement: "bottom",
        duration: 5000
      });
    } catch (error) {
      Log.error("Failed to delete selected sites", error);
      showToast({
        label: t("Something went wrong!"),
        type: "error",
        placement: "bottom"
      });
      throw error;
    } finally {
      // Refresh whatever was deleted even if a later delete failed, so the cache doesn't keep stale rows.
      if (deletedUuids.length > 0) {
        refreshTouchedSites(deletedUuids);
        onSitesChanged();
      }
      setIsUpdating(false);
    }
  }, [canDelete, deletableSites, isUpdating, onSitesChanged, t]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isUpdating) {
      return;
    }

    setIsUpdating(true);
    const submittedUuids: string[] = [];
    try {
      for (const site of submittableSites) {
        await updateSiteStatus(site.id, "pending-approval");
        submittedUuids.push(site.id);
      }
    } catch (error) {
      Log.error("Failed to submit selected sites", error);
      showToast({
        label: t("Something went wrong!"),
        type: "error",
        placement: "bottom"
      });
      throw error;
    } finally {
      // Refresh whatever was submitted even if a later submit failed, so the cache doesn't keep stale rows.
      if (submittedUuids.length > 0) {
        refreshTouchedSites(submittedUuids);
        onSitesChanged();
      }
      setIsUpdating(false);
    }
  }, [canSubmit, isUpdating, onSitesChanged, submittableSites, t]);

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
