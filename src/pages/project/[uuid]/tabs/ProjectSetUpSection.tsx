import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo } from "react";

import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { v3EntityName } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { EditIcon } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";

const stepStatusToBadge = (valid: boolean): StepProps["status"] => (valid ? "completed" : "error");

interface ProjectSetUpSectionProps {
  entity: ProjectFullDto;
  onStatusChange?: (allCompleted: boolean) => void;
}

const ProjectSetUpSection: FC<ProjectSetUpSectionProps> = ({ entity, onStatusChange }) => {
  const router = useRouter();
  const { defaultValues, steps, isReady } = useEntityFormSetup("projects", entity.uuid);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "projects",
    entityUUID: entity.uuid,
    entityStatus: entity.status ?? "started",
    updateRequestStatus: entity.updateRequestStatus ?? "no-update"
  });

  const editPath = useMemo(() => `/entity/${v3EntityName("projects")}/edit/${entity.uuid}`, [entity.uuid]);

  const tabItemsStep: StepProps[] = useMemo(() => {
    return steps.map((step, index) => {
      const valid = defaultValues == null || step.validation.isValidSync(defaultValues);
      return {
        index: index + 1,
        status: stepStatusToBadge(valid),
        label: step.title ?? "",
        actions: (
          <Button
            type="button"
            variant="borderless"
            size="small"
            leftIcon={<EditIcon boxSize={3} />}
            onClick={() => {
              if (entity.status === "awaiting-approval" || entity.updateRequestStatus === "awaiting-approval") {
                handleEdit();
              } else {
                router.push(`${editPath}?${STEP_QUERY_PARAM}=${encodeURIComponent(step.id)}`);
              }
            }}
          >
            Edit
          </Button>
        ),
        onClick: () => {
          if (entity.status === "awaiting-approval" || entity.updateRequestStatus === "awaiting-approval") {
            handleEdit();
          } else {
            router.push(`${editPath}?${STEP_QUERY_PARAM}=${encodeURIComponent(step.id)}`);
          }
        }
      };
    });
  }, [editPath, router, steps, defaultValues, entity.status, entity.updateRequestStatus, handleEdit]);

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

export default ProjectSetUpSection;
