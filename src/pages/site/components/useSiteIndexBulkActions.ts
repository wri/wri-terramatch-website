import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { deleteSite } from "@/connections/Entity";
import { entityExportAll, entityUpdate } from "@/generated/v3/entityService/entityServiceComponents";
import { getEntityEditPageLink } from "@/helpers/entity";
import { useDownloadToastMessages } from "@/hooks/translation/useDownloadToastMessages";
import ApiSlice from "@/store/apiSlice";
import { runWithDownloadToast } from "@/utils/downloadToast";
import Log from "@/utils/log";

import type { SiteIndexSite } from "./siteIndex.types";
import { groupSiteUuidsByFramework } from "./siteIndex.utils";
import { isSiteDeletable, isSiteEditable, isSiteSubmittable } from "./siteIndexSubmit";

type UseSiteIndexBulkActionsProps = {
  selectedSites: SiteIndexSite[];
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

export const useSiteIndexBulkActions = ({ selectedSites, onSitesChanged }: UseSiteIndexBulkActionsProps) => {
  const t = useT();
  const router = useRouter();
  const downloadToastMessages = useDownloadToastMessages();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const submittableSites = useMemo(() => selectedSites.filter(isSiteSubmittable), [selectedSites]);
  const deletableSites = useMemo(() => selectedSites.filter(isSiteDeletable), [selectedSites]);
  const canEdit = selectedSites.length === 1 && isSiteEditable(selectedSites[0]);
  const canSubmit = selectedSites.length > 0 && submittableSites.length === selectedSites.length;
  const canDelete = selectedSites.length > 0 && deletableSites.length === selectedSites.length;

  const refreshTouchedSites = useCallback(async (siteUuids: string[]) => {
    ApiSlice.pruneCache("sites", siteUuids);
    ApiSlice.pruneIndex("sites", "");
    ApiSlice.pruneIndex("projects", "");
  }, []);

  const handleDownload = useCallback(async () => {
    const grouped = groupSiteUuidsByFramework(selectedSites);
    if (grouped.length === 0 || isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      await runWithDownloadToast(
        {
          downloading: t("Downloading sites"),
          complete: downloadToastMessages.complete,
          error: downloadToastMessages.error
        },
        async () => {
          for (const { frameworkKey, uuids } of grouped) {
            await entityExportAll.downloadFile({
              pathParams: { entity: "sites" },
              queryParams: { frameworkKey, uuids }
            });
          }
        },
        "sitesBulkExportToast"
      );
    } catch (error) {
      Log.error("Failed to download selected sites", error);
    } finally {
      setIsDownloading(false);
    }
  }, [downloadToastMessages, isDownloading, selectedSites, t]);

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
    try {
      for (const site of deletableSites) {
        await deleteSite(site.id);
      }
      await refreshTouchedSites(deletableSites.map(site => site.id));
      onSitesChanged();
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
      setIsUpdating(false);
    }
  }, [canDelete, deletableSites, isUpdating, onSitesChanged, refreshTouchedSites, t]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      for (const site of submittableSites) {
        await updateSiteStatus(site.id, "pending-approval");
      }
      await refreshTouchedSites(submittableSites.map(site => site.id));
      onSitesChanged();
    } catch (error) {
      Log.error("Failed to submit selected sites", error);
      showToast({
        label: t("Something went wrong!"),
        type: "error",
        placement: "bottom"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [canSubmit, isUpdating, onSitesChanged, refreshTouchedSites, submittableSites, t]);

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
