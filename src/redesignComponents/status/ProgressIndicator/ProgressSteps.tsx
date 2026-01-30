import { Box, Flex } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import router from "next/router";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { getSchema } from "@/components/extensive/WizardForm/utils";
import { FormEntity } from "@/connections/Form";
import { toFramework } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { normalizedFormData } from "@/helpers/customForms";
import { v2EntityName, v3EntityName } from "@/helpers/entity";
import { useDebounce } from "@/hooks/useDebounce";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { Edit } from "@/redesignComponents/foundations/Icons";

import { Step } from "./Step";
import { ProgressStepsProps, StepProps } from "./types";

const tabOptions = {
  markDone: true,
  disableFutureTabs: true
};

export const ProgressSteps: FC<ProgressStepsProps> = ({ entityUUID, entityName }) => {
  const t = useT();
  const mode = router.query.mode as string | undefined;
  // @ts-ignore
  const [selectedStepIndex] = useState(0);
  const model = useMemo(
    () => ({ model: v3EntityName(entityName) as FormEntity, uuid: entityUUID }),
    [entityName, entityUUID]
  );
  const { updateEntityAnswers } = useFormUpdate(model.model, entityUUID);
  const { formData } = useEntityForm(model.model, entityUUID);

  const feedbackFields = useMemo(
    () => (mode?.includes("provide-feedback") ? formData?.feedbackFields ?? [] : []),
    [formData?.feedbackFields, mode]
  );

  const framework = toFramework(formData?.frameworkKey);

  const [, fieldsProvider] = useApiFieldsProvider(formData?.formUuid, feedbackFields);
  const defaultValues = useDefaultValues(formData, fieldsProvider);
  const steps = useMemo(
    () =>
      fieldsProvider.stepIds().map(stepId => ({
        id: stepId,
        title: fieldsProvider.step(stepId)?.title,
        validation: getSchema(fieldsProvider, t, framework, fieldsProvider.fieldNames(stepId))
      })),
    [framework, fieldsProvider, t]
  );

  const selectedSection = steps[selectedStepIndex];
  const formHook: UseFormReturn = useForm(
    useMemo(
      () =>
        selectedSection?.validation != null
          ? {
              resolver: yupResolver(selectedSection?.validation),
              defaultValues: defaultValues,
              mode: "onTouched"
            }
          : { mode: "onTouched" },
      [defaultValues, selectedSection?.validation]
    )
  );

  const formHasError = useRef(false);
  formHasError.current = Object.values(formHook.formState.errors ?? {}).length > 0;
  const onChange = useCallback(
    (data: Dictionary<any>) => {
      updateEntityAnswers({ answers: normalizedFormData(data, fieldsProvider) });
    },
    [fieldsProvider, updateEntityAnswers]
  );
  const _onChange = useDebounce(
    useCallback(() => !formHasError.current && onChange?.(formHook.getValues()), [formHook, onChange]),
    // Send an update to the server at most once per second
    1000
  );

  const renderStep = useCallback(
    (stepId: string) => <FormStep id="step" stepId={stepId} formHook={formHook} onChange={_onChange} />,
    [formHook, _onChange]
  );

  const stepTabItems = useMemo(
    () =>
      steps.map(({ id, title }, index) => ({
        title: title ?? "",
        done: tabOptions.markDone && index < selectedStepIndex,
        disabled: tabOptions.disableFutureTabs && index > selectedStepIndex,
        renderBody: () => renderStep(id)
      })),
    [renderStep, steps, selectedStepIndex]
  );

  const tabItems: TabItem[] = stepTabItems;

  const handleEditStep = useCallback(
    (index: number) => {
      const editPath = `/entity/${v2EntityName(entityName)}/edit/${entityUUID}`;
      router.push(`${editPath}?step=${index}`);
    },
    [entityName, entityUUID]
  );

  const tabItemsStep: StepProps[] = tabItems.map((item, index) => ({
    ...item,
    index: index + 1,
    status: selectedStepIndex === index ? "active" : item.done ? "completed" : item.disabled ? "disabled" : "active",
    label: item.title,
    actions: (
      <Button
        type="button"
        variant="borderless"
        size="small"
        leftIcon={<Edit boxSize={3} />}
        onClick={() => handleEditStep(index)}
      >
        Edit
      </Button>
    )
  }));

  return (
    <Box>
      {tabItemsStep.map((step, index) => (
        <Box key={step.index ?? index}>
          <Step {...step} />
          {index < steps.length - 1 && (
            <Flex ml={4} my={2}>
              <Box backgroundColor="neutral.400" height="12px" width="1px" rounded="full" />
            </Flex>
          )}
        </Box>
      ))}
    </Box>
  );
};
