import { useFormStepsSummary } from "@/components/extensive/WizardForm/useFormStepsSummary";
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
import { useMemo } from "react";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { Box, Spinner } from "@chakra-ui/react";


const mapStatus = (status: string): StepProps["status"] => {
  switch (status) {
    case "completed":
      return "completed";
    case "error":
      return "error";
    case "active":
      return "error";
    case "available":
      return "available";
    default:
      return "available";
  }
};

const EntitySetUpSection = ({ entityUuid }: { entityUuid: string }) => {
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
  const stepsWithStatus = useFormStepsSummary(fieldsProvider, framework, defaultValues);

  const isReady = !isFormLoading && providerLoaded;

  const editPath = useMemo(
    () => `/entity/${v2EntityName("projects")}/edit/${entityUuid}`,
    [entityUuid]
  );

  const tabItemsStep: StepProps[] = useMemo(
    () =>
      stepsWithStatus.map((step, index) => {
        return {
          index: index + 1,
          status: mapStatus(step.status),
          label: step.title ?? "",
          actions: (
            <Button
              type="button"
              variant="borderless"
              size="small"
              leftIcon={<Edit boxSize={3} />}
              onClick={() => router.push(`${editPath}?formStepId=${encodeURIComponent(step.id)}`)}
            >
              Edit
            </Button>
          ),
          onClick: () => router.push(`${editPath}?formStepId=${encodeURIComponent(step.id)}`)
        };
      }),
    [editPath, router, stepsWithStatus]
  );

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
