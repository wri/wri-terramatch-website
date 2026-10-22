import { FC, useEffect } from "react";

import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { EntityName } from "@/types/common";

type EntitySubmissionProbeProps = {
  entityName: Extract<EntityName, "sites" | "nurseries">;
  entityUuid: string;
  onResult: (entityUuid: string, complete: boolean) => void;
};

/**
 * Checks an entity's saved answers against every step of its form, using the same rules the edit form uses
 * to block submission. Renders nothing; it only reports whether the entity is complete.
 */
const EntitySubmissionProbe: FC<EntitySubmissionProbeProps> = ({ entityName, entityUuid, onResult }) => {
  const { steps, defaultValues, isReady } = useEntityFormSetup(entityName, entityUuid);

  useEffect(() => {
    if (!isReady) return;
    onResult(
      entityUuid,
      steps.every(({ validation }) => validation.isValidSync(defaultValues))
    );
  }, [defaultValues, entityUuid, isReady, onResult, steps]);

  return null;
};

export default EntitySubmissionProbe;
