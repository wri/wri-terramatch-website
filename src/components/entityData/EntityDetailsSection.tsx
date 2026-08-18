import { Box, Spinner } from "@chakra-ui/react";
import { FC, useEffect, useMemo } from "react";

import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import { useStepCompletion } from "@/components/extensive/WizardForm/useStepCompletion";
import { APPROVED } from "@/constants/statuses";
import WizardFormProvider from "@/context/wizardForm.provider";
import { ProjectFullDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";

interface EntityDetailsSectionProps {
  entity: ProjectFullDto | SiteFullDto;
  type: "projects" | "sites";
  onStatusChange?: (allCompleted: boolean) => void;
}

/**
 * The single, consolidated setup/details surface on the Overview tab for projects and sites.
 *
 * It replaces the old duplication (a progress-bar-only "Set Up" card here, plus a full editable
 * accordion form on the "Details and Data" tab). One representation now:
 *  - Not approved: the `ProgressSteps` bar (via `EntitySetUpSection`, unchanged) on top of the
 *    collapsed `SharedDetails` accordions.
 *  - Approved: no progress bar — just the accordions. Any step still invalid (e.g. Photos) keeps its
 *    own `error` badge and is auto-expanded so the remaining gap is visible.
 *
 * The `SharedDetails` accordions require `WizardFormContext` (its default is a silent stub), so the
 * stack is wrapped in `WizardFormProvider`. The loading gate is section-local (a centered spinner)
 * so the rest of Overview — map, KPIs — renders immediately.
 */
const EntityDetailsSection: FC<EntityDetailsSectionProps> = ({ entity, type, onStatusChange }) => {
  const { steps, defaultValues, fieldsProvider, feedbackFields, feedbackBaselineValues, isReady } = useEntityFormSetup(
    type,
    entity.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData(type, entity);
  const { stepCompletions, allStepsCompleted } = useStepCompletion(
    steps,
    defaultValues,
    fieldsProvider,
    feedbackFields,
    feedbackBaselineValues
  );

  const isApproved = entity.status === APPROVED;
  const formValues = useMemo(() => defaultValues ?? {}, [defaultValues]);
  const completedById = useMemo(
    () => new Map(stepCompletions.map(({ id, completed }) => [id, completed])),
    [stepCompletions]
  );

  useEffect(() => {
    onStatusChange?.(allStepsCompleted);
  }, [allStepsCompleted, onStatusChange]);

  return (
    <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
      {!isReady || orgLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="120px" gap={3}>
          <Spinner size="sm" />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={4}>
          {!isApproved && <EntitySetUpSection entity={entity} type={type} />}
          <WizardFormProvider fieldsProvider={fieldsProvider} orgDetails={orgDetails}>
            {steps.map((step, index) => (
              <SharedDetails
                key={step.id}
                step={step}
                formValues={formValues}
                entityName={type}
                entityUUID={entity.uuid}
                entityStatus={entity.status}
                updateRequestStatus={entity.updateRequestStatus}
                stepIndex={index}
                entity={entity}
                feedbackFieldsOptions={entity.feedbackFields}
                feedbackBaselineValues={feedbackBaselineValues}
                defaultOpen={isApproved && !(completedById.get(step.id) ?? false)}
              />
            ))}
          </WizardFormProvider>
        </Box>
      )}
    </Box>
  );
};

export default EntityDetailsSection;
