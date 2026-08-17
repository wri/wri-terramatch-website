import { useMemo, useState } from "react";

import ActionGroupRow from "@/components/projectData/actions/ActionGroupRow";
import ActionRow from "@/components/projectData/actions/ActionRow";
import { useAnomalyActions } from "@/components/projectData/actions/useAnomalyActions";
import { Anomaly } from "@/components/projectData/anomalies/types";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ChevronDownIcon } from "@/redesignComponents/foundations/Icons";

import { EntityLevel } from "./entityLevel";
import { useEntityAnomalies } from "./useEntityAnomalies";

/**
 * "Actions you might need this week" — the anomaly work-queue, for a project or a site.
 *
 * The one panel for both levels: it reads the level-scoped anomalies, orders by severity, collapses
 * the validation floods into summary rows (a project can carry dozens of identical "partial geometry"
 * rows, which would bury the standout watchlist items), and offers a real inline Approve where an
 * anomaly is genuinely resolvable — a geometry-validation polygon a reviewer can accept — deep-linking
 * everything else. Collapsed by default; the header always shows the open count.
 */
export interface EntityActionsPanelProps {
  level: EntityLevel;
  projectUuid: string;
  /** Required at site level. */
  siteUuid?: string;
  /** Project level only, so the goal-relative watchlist checks can fire. */
  project?: ProjectFullDto;
}

const EntityActionsPanel = ({ level, projectUuid, siteUuid, project }: EntityActionsPanelProps) => {
  const [open, setOpen] = useState(false);
  const { loaded, anomalies, totalCount } = useEntityAnomalies({ level, projectUuid, siteUuid, project });

  // Each polygon's review status, so Approve is only offered where it is not already approved. Scoped
  // to the level; resolves from the redux cache the anomaly engine already populated.
  const { data: polygons } = useAllSitePolygons({
    entityName: level === "project" ? "projects" : "sites",
    entityUuid: level === "project" ? projectUuid : siteUuid,
    enabled: (level === "project" ? projectUuid : siteUuid) != null
  });

  const statusByUuid = useMemo(() => {
    const map: Record<string, string | null> = {};
    for (const polygon of polygons ?? []) map[polygon.uuid] = polygon.status ?? null;
    return map;
  }, [polygons]);

  const { visible, isApprovable, isApproving, approve, approveMany, dismiss, dismissMany } = useAnomalyActions({
    anomalies,
    statusByUuid
  });

  const groups = useMemo(() => {
    const order: string[] = [];
    const byKey = new Map<string, Anomaly[]>();
    for (const anomaly of visible) {
      const key = `${anomaly.type}:${anomaly.severity}`;
      if (!byKey.has(key)) {
        byKey.set(key, []);
        order.push(key);
      }
      byKey.get(key)!.push(anomaly);
    }
    return order.map(key => ({ key, items: byKey.get(key)! }));
  }, [visible]);

  return (
    <section className="w-full overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-theme-neutral-100"
      >
        <div className="flex items-center gap-2">
          <ChevronDownIcon
            className={`text-theme-neutral-500 transition-transform ${open ? "" : "-rotate-90"}`}
            boxSize={4}
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-theme-neutral-400">This week</p>
            <h3 className="text-base font-semibold text-theme-neutral-900">Actions you might need</h3>
          </div>
        </div>
        {loaded && visible.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-theme-warning-100 px-2.5 py-1 text-xs font-semibold text-theme-warning-900">
            {visible.length} open
          </span>
        )}
      </button>

      <div className={`border-t border-theme-neutral-200 px-4 ${open ? "" : "hidden"}`}>
        {!loaded ? (
          <p className="py-6 text-sm text-theme-neutral-500">Checking for anomalies…</p>
        ) : totalCount === 0 ? (
          <p className="py-6 text-sm text-theme-neutral-500">No open anomalies — nothing needs attention this week.</p>
        ) : visible.length === 0 ? (
          <p className="py-6 text-sm text-theme-neutral-500">You’re all caught up — every action has been handled.</p>
        ) : (
          <ul>
            {groups.map(group =>
              group.items.length === 1 ? (
                <ActionRow
                  key={group.key}
                  anomaly={group.items[0]}
                  projectUuid={projectUuid}
                  approvable={isApprovable(group.items[0])}
                  approving={isApproving(group.items[0].id)}
                  onApprove={approve}
                  onDismiss={dismiss}
                />
              ) : (
                <ActionGroupRow
                  key={group.key}
                  items={group.items}
                  projectUuid={projectUuid}
                  isApprovable={isApprovable}
                  isApproving={isApproving}
                  onApprove={approve}
                  onApproveMany={approveMany}
                  onDismiss={dismiss}
                  onDismissMany={dismissMany}
                />
              )
            )}
          </ul>
        )}
      </div>
    </section>
  );
};

export default EntityActionsPanel;
