import { useMemo } from "react";

import { useFullProject } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { Anomaly } from "../anomalies/types";
import { useProjectAnomalies } from "../anomalies/useProjectAnomalies";
import ActionRow from "./ActionRow";
import { useAnomalyActions } from "./useAnomalyActions";

/**
 * The condensed Actions strip for a single entity — used on the polygon page beside the status pills.
 *
 * It reuses the exact same anomaly source and controls as the project panel, filtered to one entity,
 * so a polygon's "Geometry validation failed / Approve" reads and behaves identically whether the
 * reviewer meets it in the project queue or on the polygon's own page. Renders nothing when the
 * entity is clean, so it never adds empty chrome to a healthy polygon.
 */
export interface EntityActionsProps {
  projectUuid: string;
  entityUuid: string;
  /** The entity's current review status, so Approve is only offered when it is not already approved. */
  entityStatus?: string | null;
  /** Passed when the caller already has the project DTO, to avoid a redundant fetch. */
  project?: ProjectFullDto;
  /** Pre-filtered anomalies, if the caller already computed them. Otherwise they are derived here. */
  anomalies?: Anomaly[];
}

const EntityActions = ({ projectUuid, entityUuid, entityStatus, project, anomalies: passed }: EntityActionsProps) => {
  // The anomaly engine needs the project DTO to run its watchlist checks; fetch it only when the
  // caller has not supplied it (and not at all when a ready anomaly list was passed in).
  const [, { data: fetchedProject }] = useFullProject({ id: projectUuid });
  const projectDto = project ?? fetchedProject;

  const { anomalies: computed } = useProjectAnomalies(projectUuid, projectDto);
  const forEntity = useMemo(
    () => (passed ?? computed).filter(anomaly => anomaly.entityUuid === entityUuid),
    [passed, computed, entityUuid]
  );

  const statusByUuid = useMemo(() => ({ [entityUuid]: entityStatus ?? null }), [entityUuid, entityStatus]);

  const { visible, isApprovable, isApproving, approve, dismiss } = useAnomalyActions({
    anomalies: forEntity,
    statusByUuid
  });

  if (visible.length === 0) return null;

  return (
    <div className="rounded-lg border border-theme-warning-100 bg-theme-warning-100/40 px-3 py-2">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-theme-warning-900">Needs attention</p>
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
            compact
          />
        ))}
      </ul>
    </div>
  );
};

export default EntityActions;
