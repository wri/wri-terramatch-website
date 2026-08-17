import { useMemo } from "react";

import { useAllSitePolygons } from "@/connections/SitePolygons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { useProjectAnomalies } from "../anomalies/useProjectAnomalies";
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

  const { visible, isApprovable, isApproving, approve, dismiss } = useAnomalyActions({ anomalies, statusByUuid });

  return (
    <section className="w-full overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-theme-neutral-200 px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-theme-neutral-400">This week</p>
          <h3 className="text-base font-semibold text-theme-neutral-900">Actions you might need</h3>
        </div>
        {loaded && visible.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-theme-warning-100 px-2.5 py-1 text-xs font-semibold text-theme-warning-900">
            {visible.length} open
          </span>
        )}
      </header>

      <div className="px-4">
        {!loaded ? (
          <p className="py-6 text-sm text-theme-neutral-500">Checking for anomalies…</p>
        ) : totalCount === 0 ? (
          <p className="py-6 text-sm text-theme-neutral-500">No open anomalies — nothing needs attention this week.</p>
        ) : visible.length === 0 ? (
          // Everything was dismissed or approved this session — a calmer state than "none found".
          <p className="py-6 text-sm text-theme-neutral-500">You’re all caught up — every action has been handled.</p>
        ) : (
          <ul>
            {visible.map(anomaly => (
              <ActionRow
                key={anomaly.id}
                anomaly={anomaly}
                projectUuid={projectUuid}
                approvable={isApprovable(anomaly)}
                approving={isApproving(anomaly.id)}
                onApprove={approve}
                onDismiss={dismiss}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ProjectActionsPanel;
