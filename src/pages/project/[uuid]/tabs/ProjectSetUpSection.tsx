import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";

import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { v2EntityName } from "@/helpers/entity";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { Edit } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";

const stepStatusToBadge = (valid: boolean): StepProps["status"] => (valid ? "completed" : "error");

const ProjectSetUpSection: FC<{ entityUuid: string }> = ({ entityUuid }) => {
  const router = useRouter();
  const { defaultValues, steps, isReady } = useEntityFormSetup("projects", entityUuid);

  const editPath = useMemo(() => `/entity/${v2EntityName("projects")}/edit/${entityUuid}`, [entityUuid]);

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
            leftIcon={<Edit boxSize={3} />}
            onClick={() => router.push(`${editPath}?${STEP_QUERY_PARAM}=${encodeURIComponent(step.id)}`)}
          >
            Edit
          </Button>
        ),
        onClick: () => router.push(`${editPath}?${STEP_QUERY_PARAM}=${encodeURIComponent(step.id)}`)
      };
    });
  }, [editPath, router, steps, defaultValues]);

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
