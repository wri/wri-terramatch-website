import { useCallback, useMemo, useState } from "react";

import { bulkUpdateSitePolygonStatus, PolygonStatus, pruneSitePolygonsCache } from "@/connections/SitePolygons";
import { POLYGON_APPROVED } from "@/constants/polygonStatuses";
import { ToastType, useToastContext } from "@/context/toast.provider";
import Log from "@/utils/log";

import { Anomaly } from "../anomalies/types";

/**
 * The side-effect layer for the Actions experience.
 *
 * The anomaly engine (`useProjectAnomalies` / `computeAnomalies`) is pure and describes only what a
 * row should offer via `suggestedAction`. This hook is the one place those descriptions become real
 * actions: it owns the local dismiss state, the inline approve mutation, and the toast feedback, so
 * both the project panel and the per-entity strip share exactly one implementation and can never
 * drift apart on what "Approve" or "Dismiss" means.
 */

const APPROVE_COMMENT = "Approved from the project Actions panel.";

export type UseAnomalyActions = {
  /** Anomalies still open this session — the input list minus anything dismissed or just approved. */
  visible: Anomaly[];
  /** Whether an anomaly's suggested control should be a real inline Approve (vs. a deep-link). */
  isApprovable: (anomaly: Anomaly) => boolean;
  /** True while an approve request for this anomaly is in flight, so the button can show progress. */
  isApproving: (anomalyId: string) => boolean;
  /** Fire the real polygon status update, then optimistically drop the row on success. */
  approve: (anomaly: Anomaly) => Promise<void>;
  /** Approve every approvable anomaly in a group in one request — the grouped "Approve all N". */
  approveMany: (group: Anomaly[]) => Promise<void>;
  /** Local acknowledge — hides the row for this session only (see note below). */
  dismiss: (anomalyId: string) => void;
  /** Local acknowledge for a whole group at once. */
  dismissMany: (anomalyIds: string[]) => void;
};

export const useAnomalyActions = ({
  anomalies,
  statusByUuid
}: {
  anomalies: Anomaly[];
  /** Current polygon status keyed by uuid, so we only offer Approve where it is not already approved. */
  statusByUuid: Record<string, string | null | undefined>;
}): UseAnomalyActions => {
  const { openToast } = useToastContext();
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [approving, setApproving] = useState<Set<string>>(() => new Set());

  const isApprovable = useCallback(
    (anomaly: Anomaly) =>
      // Approving means moving a polygon's review status to "approved". Geometry-validation anomalies
      // are the case the reviewer can genuinely accept in place; watchlist anomalies need a human to
      // investigate first, so they never get an inline Approve. An already-approved polygon is skipped.
      anomaly.type === "geometryValidation" &&
      anomaly.source === "validation" &&
      anomaly.level === "polygon" &&
      (statusByUuid[anomaly.entityUuid] ?? null) !== POLYGON_APPROVED,
    [statusByUuid]
  );

  const isApproving = useCallback((anomalyId: string) => approving.has(anomalyId), [approving]);

  const dismiss = useCallback((anomalyId: string) => {
    // Local acknowledge only. Real persistence (an acknowledged-anomalies store keyed by user) is
    // out of scope for this pass — the row simply hides until the page is reloaded.
    setDismissed(prev => new Set(prev).add(anomalyId));
  }, []);

  const approve = useCallback(
    async (anomaly: Anomaly) => {
      setApproving(prev => new Set(prev).add(anomaly.id));
      try {
        await bulkUpdateSitePolygonStatus([anomaly.entityUuid], POLYGON_APPROVED as PolygonStatus, APPROVE_COMMENT);
        // Optimistically drop the row, then prune so any later mount re-derives from fresh polygons.
        // A full live refetch of `useProjectAnomalies` is not wired here because that hook exposes no
        // refetch and this pass is scoped not to edit it; the optimistic hide is the source of truth
        // for the session.
        setDismissed(prev => new Set(prev).add(anomaly.id));
        pruneSitePolygonsCache();
        openToast(`Approved “${anomaly.entityName}”.`, ToastType.SUCCESS);
      } catch (error) {
        Log.error("Failed to approve polygon from the Actions panel", error);
        openToast(`Could not approve “${anomaly.entityName}”. Please try again.`, ToastType.ERROR);
      } finally {
        setApproving(prev => {
          const next = new Set(prev);
          next.delete(anomaly.id);
          return next;
        });
      }
    },
    [openToast]
  );

  const approveMany = useCallback(
    async (group: Anomaly[]) => {
      // Only the approvable members go to the endpoint; a mixed group (e.g. an already-approved
      // polygon slipped in) still approves the rest rather than failing the whole batch.
      const approvables = group.filter(anomaly => isApprovable(anomaly));
      if (approvables.length === 0) return;

      const ids = approvables.map(anomaly => anomaly.id);
      const uuids = approvables.map(anomaly => anomaly.entityUuid);
      setApproving(prev => new Set([...prev, ...ids]));
      try {
        // One request for the whole group — bulkUpdateSitePolygonStatus already takes an array.
        await bulkUpdateSitePolygonStatus(uuids, POLYGON_APPROVED as PolygonStatus, APPROVE_COMMENT);
        setDismissed(prev => new Set([...prev, ...ids]));
        pruneSitePolygonsCache();
        openToast(`Approved ${uuids.length} ${uuids.length === 1 ? "polygon" : "polygons"}.`, ToastType.SUCCESS);
      } catch (error) {
        Log.error("Failed to bulk-approve polygons from the Actions panel", error);
        openToast(`Could not approve ${uuids.length} polygons. Please try again.`, ToastType.ERROR);
      } finally {
        setApproving(prev => {
          const next = new Set(prev);
          ids.forEach(id => next.delete(id));
          return next;
        });
      }
    },
    [isApprovable, openToast]
  );

  const dismissMany = useCallback((anomalyIds: string[]) => {
    setDismissed(prev => new Set([...prev, ...anomalyIds]));
  }, []);

  const visible = useMemo(() => anomalies.filter(anomaly => !dismissed.has(anomaly.id)), [anomalies, dismissed]);

  return { visible, isApprovable, isApproving, approve, approveMany, dismiss, dismissMany };
};
