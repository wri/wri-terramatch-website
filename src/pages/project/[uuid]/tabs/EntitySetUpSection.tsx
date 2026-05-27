import { Box, Spinner } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useMemo } from "react";

import { EntityFullDto, SupportedEntity } from "@/connections/Entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { EditIcon } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";

const stepStatusToBadge = (valid: boolean): StepProps["status"] => (valid ? "completed" : "error");

interface EntitySetUpSectionProps {
  entity: EntityFullDto;
  onStatusChange?: (allCompleted: boolean) => void;
  type: SupportedEntity;
}

const EntitySetUpSection: FC<EntitySetUpSectionProps> = ({ entity, onStatusChange, type }) => {
  const t = useT();
  const { defaultValues, steps, isReady } = useEntityFormSetup(type, entity.uuid);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: type,
    entityUUID: entity.uuid,
    entityStatus: entity.status ?? "started",
    updateRequestStatus: entity.updateRequestStatus ?? "no-update"
  });

  const feedbackFields = useMemo(() => entity.feedbackFields ?? [], [entity.feedbackFields]);

  const tabItemsStep: StepProps[] = useMemo(() => {
    return steps.map((step, index) => {
      const items = step.validation["_nodes"];
      const isFeedbackField = items.some((item: string) => feedbackFields.includes(item));
      const valid = defaultValues == null || step.validation.isValidSync(defaultValues);
      return {
        index: index + 1,
        status: isFeedbackField ? "warning" : stepStatusToBadge(valid),
        label: step.title ?? "",
        actions: (
          <Button
            type="button"
            variant="borderless"
            size="small"
            leftIcon={<EditIcon boxSize={3} />}
            onClick={() => {
              handleEdit(step.id);
            }}
          >
            {t("Edit")}
          </Button>
        ),
        onClick: () => {
          handleEdit(step.id);
        }
      };
    });
  }, [t, steps, defaultValues, handleEdit, feedbackFields]);

  const allStepsCompleted = useMemo(() => {
    if (!steps.length) return false;

    return steps.every(step => {
      const valid = defaultValues == null || step.validation.isValidSync(defaultValues);
      return stepStatusToBadge(valid) === "completed";
    });
  }, [steps, defaultValues]);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(allStepsCompleted);
    }
  }, [allStepsCompleted, onStatusChange]);

  if (!isReady) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="120px" gap={3}>
        <Spinner size="sm" />
      </Box>
    );
  }

  return <ProgressSteps steps={tabItemsStep} />;
};

export default EntitySetUpSection;
