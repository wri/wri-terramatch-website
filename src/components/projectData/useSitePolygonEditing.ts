import { useCallback, useState } from "react";

import {
  BulkSitePolygonAttributeChanges,
  bulkUpdateSitePolygonAttributes,
  bulkUpdateSitePolygonStatus,
  PolygonStatus,
  pruneSitePolygonsCache
} from "@/connections/SitePolygons";
import { POLYGON_APPROVED } from "@/constants/polygonStatuses";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

/**
 * The side-effect layer for editing polygons from the project table.
 *
 * It mirrors `useAnomalyActions`: the real mutation runs first, and only on success is an optimistic
 * override applied locally and the cache pruned — never a fake success. `useAllSitePolygons` exposes
 * no live re-derive on prune alone, so these session-scoped overrides (keyed by uuid, merged onto
 * each row by the table) are the source of truth for the change until the next full mount, exactly
 * as the Actions panel optimistically hides approved rows.
 */

const APPROVE_COMMENT = "Approved from the project data table.";

/** Apply an attribute-changes payload onto a polygon so the table reflects it immediately. */
const applyChanges = (polygon: SitePolygonLightDto, changes: BulkSitePolygonAttributeChanges): SitePolygonLightDto => {
  const next = { ...polygon };
  if (changes.practice !== undefined) next.practice = changes.practice;
  if (changes.distr !== undefined) next.distr = changes.distr;
  if (changes.targetSys !== undefined) next.targetSys = changes.targetSys;
  if (changes.submissionCycle !== undefined) {
    next.submissionCycle = (
      changes.submissionCycle === "" ? null : changes.submissionCycle
    ) as SitePolygonLightDto["submissionCycle"];
  }
  if (changes.plantStart !== undefined) next.plantStart = changes.plantStart === "" ? null : changes.plantStart;
  if (changes.numTrees !== undefined) next.numTrees = changes.numTrees;
  return next;
};

export type SitePolygonOverride = Partial<SitePolygonLightDto>;

export const useSitePolygonEditing = () => {
  const { openToast } = useToastContext();
  const [overrides, setOverrides] = useState<Record<string, SitePolygonOverride>>({});
  const [isApproving, setIsApproving] = useState(false);
  const [isSavingAttributes, setIsSavingAttributes] = useState(false);
  const [savingRowUuid, setSavingRowUuid] = useState<string | null>(null);

  /** Merge a polygon with any optimistic override recorded for it. */
  const withOverride = useCallback(
    (polygon: SitePolygonLightDto): SitePolygonLightDto => {
      const override = overrides[polygon.uuid];
      return override == null ? polygon : { ...polygon, ...override };
    },
    [overrides]
  );

  const approve = useCallback(
    async (uuids: string[]): Promise<boolean> => {
      if (uuids.length === 0) return false;
      setIsApproving(true);
      try {
        await bulkUpdateSitePolygonStatus(uuids, POLYGON_APPROVED as PolygonStatus, APPROVE_COMMENT);
        setOverrides(prev => {
          const next = { ...prev };
          uuids.forEach(uuid => {
            next[uuid] = { ...next[uuid], status: POLYGON_APPROVED as SitePolygonLightDto["status"] };
          });
          return next;
        });
        pruneSitePolygonsCache();
        openToast(`Approved ${uuids.length} ${uuids.length === 1 ? "polygon" : "polygons"}.`, ToastType.SUCCESS);
        return true;
      } catch (error) {
        Log.error("Failed to bulk-approve polygons from the project data table", error);
        openToast(
          `Could not approve ${uuids.length === 1 ? "the polygon" : "the polygons"}. Please try again.`,
          ToastType.ERROR
        );
        return false;
      } finally {
        setIsApproving(false);
      }
    },
    [openToast]
  );

  const applyAttributes = useCallback(
    async (
      polygons: SitePolygonLightDto[],
      changes: BulkSitePolygonAttributeChanges,
      { row = false }: { row?: boolean } = {}
    ): Promise<boolean> => {
      const uuids = polygons.map(polygon => polygon.uuid);
      if (uuids.length === 0) return false;
      if (row) setSavingRowUuid(uuids[0]);
      else setIsSavingAttributes(true);
      try {
        await bulkUpdateSitePolygonAttributes(uuids, changes);
        setOverrides(prev => {
          const next = { ...prev };
          polygons.forEach(polygon => {
            const applied = applyChanges({ ...polygon, ...prev[polygon.uuid] }, changes);
            next[polygon.uuid] = {
              ...prev[polygon.uuid],
              practice: applied.practice,
              distr: applied.distr,
              targetSys: applied.targetSys,
              submissionCycle: applied.submissionCycle,
              plantStart: applied.plantStart,
              numTrees: applied.numTrees
            };
          });
          return next;
        });
        pruneSitePolygonsCache();
        openToast(`Updated ${uuids.length} ${uuids.length === 1 ? "polygon" : "polygons"}.`, ToastType.SUCCESS);
        return true;
      } catch (error) {
        Log.error("Failed to update polygon attributes from the project data table", error);
        openToast(
          `Could not update ${uuids.length === 1 ? "the polygon" : "the polygons"}. Please try again.`,
          ToastType.ERROR
        );
        return false;
      } finally {
        if (row) setSavingRowUuid(null);
        else setIsSavingAttributes(false);
      }
    },
    [openToast]
  );

  return {
    withOverride,
    approve,
    applyAttributes,
    isApproving,
    isSavingAttributes,
    savingRowUuid
  };
};
