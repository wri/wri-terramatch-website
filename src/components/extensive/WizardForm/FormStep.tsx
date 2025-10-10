import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { IButtonProps } from "@/components/elements/Button/Button";
import List from "@/components/extensive/List/List";
import FormField from "@/components/extensive/WizardForm/FormField";
import FormStepHeader from "@/components/extensive/WizardForm/FormStepHeader";
import { useFieldsProvider } from "@/context/wizardForm.provider";

interface FormTabProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  stepId: string;
  formHook: UseFormReturn;
  onChange: () => void;
  actionButtonProps?: IButtonProps;
}

export const FormStep = ({
  stepId,
  formHook,
  onChange,
  actionButtonProps,
  children,
  ...divProps
}: PropsWithChildren<FormTabProps>) => {
  const { step, fieldNames } = useFieldsProvider();
  const stepDefinition = step(stepId);
  const stepFieldIds = useMemo(() => fieldNames(stepId), [fieldNames, stepId]);

  useEffect(() => {
    formHook.clearErrors();
  }, [stepId, formHook]);

  if (stepDefinition == null) return null;

  return (
    <FormStepHeader
      {...divProps}
      title={stepDefinition.title ?? undefined}
      subtitle={stepDefinition.description ?? undefined}
    >
      {stepFieldIds.length === 0 ? null : (
        <List
          items={stepFieldIds}
          uniqueId="name"
          itemClassName="mt-8"
          render={fieldId => <FormField key={fieldId} fieldId={fieldId} formHook={formHook} onChange={onChange} />}
        />
      )}
      {children}
    </FormStepHeader>
  );
};
