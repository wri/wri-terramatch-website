import { useMemo, useState } from "react";

import { useAllSitePolygons } from "@/connections/SitePolygons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ChevronDownIcon } from "@/redesignComponents/foundations/Icons";

import { Anomaly } from "../anomalies/types";
import { useProjectAnomalies } from "../anomalies/useProjectAnomalies";
import ActionGroupRow from "./ActionGroupRow";
import ActionRow from "./ActionRow";
import { useAnomalyActions } from "./useAnomalyActions";

/**
 * "Actions you might need this week" — the anomaly-driven work queue on the project overview.
 *
 * It reads the merged anomaly list, orders it by severity (already sorted by the engine), and offers
 * one control per row. Where an anomaly is genuinely resolvable in place — a geometry-validation
 * polygon a reviewer can accept — the row carries a real inline Approve; everywhere else it deep-links
 * to the page where the work actually happens. The product intent is "act without switching tools",
 * so the panel resolves what it safely can and routes the rest.
 */
export interface ProjectActionsPanelProps {
  projectUuid: string;
  project?: ProjectFullDto;
}

const ProjectActionsPanel = ({ projectUuid, project }: ProjectActionsPanelProps) => {
  // Collapsed by default: the panel is a work queue you open when you're triaging, not something to
  // scroll past every visit. The header always shows the open count so the signal survives collapse.
  const [open, setOpen] = useState(false);
  const { loaded, anomalies, totalCount } = useProjectAnomalies(projectUuid, project);

  // The same "all polygons for the project" data the anomaly engine reads, used here to know each
  // polygon's review status so Approve is only offered where it is not already approved. It resolves
  // from the redux cache the engine has already populated, so this is not a second network round-trip.
  const { data: polygons } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: projectUuid,
    enabled: projectUuid != null && projectUuid !== ""
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

  // Group by (type, severity), preserving the engine's severity-first order. Validation floods the
  // list — one project can carry dozens of identical "partial geometry" rows — so a multi-item group
  // collapses into a single summary row and the standout singletons (the watchlist anomalies) keep
  // their own row.
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
          // Everything was dismissed or approved this session — a calmer state than "none found".
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

export default ProjectActionsPanel;
