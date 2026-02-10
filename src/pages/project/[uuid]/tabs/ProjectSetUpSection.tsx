import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { FormEntity } from "@/connections/Form";
import { toFramework } from "@/context/framework.provider";
import { Framework } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { v2EntityName, v3EntityName } from "@/helpers/entity";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { Edit } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { Box, Spinner } from "@chakra-ui/react";

const stepStatusToBadge = (valid: boolean): StepProps["status"] => (valid ? "completed" : "error");

const ProjectSetUpSection: FC<{ entityUuid: string }> = ({ entityUuid }) => {
  const router = useRouter();
  const mode = router.query.mode as string | undefined;
  const model = useMemo(() => ({ model: v3EntityName("projects") as FormEntity, uuid: entityUuid }), [entityUuid]);
  const { formData, isLoading: isFormLoading } = useEntityForm(model.model, entityUuid);
  const framework = toFramework(formData?.frameworkKey) as Framework;
  const feedbackFields = useMemo(
    () => (mode?.includes("provide-feedback") ? formData?.feedbackFields ?? [] : []),
    [formData?.feedbackFields, mode]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.formUuid, feedbackFields);
  const defaultValues = useDefaultValues(formData, fieldsProvider);
  const steps = useFormStepsWithValidation(fieldsProvider, framework);

  const isReady = !isFormLoading && providerLoaded;

  const editPath = useMemo(
    () => `/entity/${v2EntityName("projects")}/edit/${entityUuid}`,
    [entityUuid]
  );

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
