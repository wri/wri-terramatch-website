import { Box, Flex } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import router from "next/router";
import { FC, useCallback, useMemo, useRef } from "react";
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

  const firstIncompleteStepIndex = useMemo(() => {
    if (defaultValues == null) return 0;
    const idx = steps.findIndex(({ validation }) => !validation.isValidSync(defaultValues));
    return idx < 0 ? steps.length : idx;
  }, [defaultValues, steps]);

  const selectedSection = steps[0];
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
        done: tabOptions.markDone && index < firstIncompleteStepIndex,
        // TODO: Uncomment this when we have a way to disable the future steps
        // disabled: tabOptions.disableFutureTabs && index > firstIncompleteStepIndex,
        disabled: false,
        renderBody: () => renderStep(id)
      })),
    [firstIncompleteStepIndex, renderStep, steps]
  );

  const tabItems: TabItem[] = stepTabItems;

  const handleEditStep = useCallback(
    (index: number) => {
      const editPath = `/entity/${v2EntityName(entityName)}/edit/${entityUUID}`;
      router.push(`${editPath}?step=${index}`);
    },
    [entityName, entityUUID]
  );

  // TODO: Uncomment this when we have a way to edit the step
  // const isStepEditable = useCallback(
  //   (index: number) => index <= firstIncompleteStepIndex,
  //   [firstIncompleteStepIndex]
  // );

  const tabItemsStep: StepProps[] = tabItems.map((item, index) => {
    const done = item.done ?? false;
    const disabled = item.disabled ?? false;
    // TODO: Uncomment this when we have a way to edit the step
    // const editable = isStepEditable(index);
    const isFirstIncomplete = index === firstIncompleteStepIndex && index < steps.length;
    const status: StepProps["status"] = done
      ? "completed"
      : disabled
      ? "disabled"
      : isFirstIncomplete
      ? "error"
      : "active";
    return {
      ...item,
      index: index + 1,
      status,
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
      ),
      onClick: () => handleEditStep(index)
    };
  });

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
