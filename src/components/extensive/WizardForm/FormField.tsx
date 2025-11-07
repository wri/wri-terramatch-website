import { FC, useMemo } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";

import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { SharedFieldProps } from "@/components/extensive/WizardForm/types";
import { useFieldsProvider } from "@/context/wizardForm.provider";

type FormQuestionProps = {
  fieldId: string;
  formHook: UseFormReturn;
  onChange: () => void;
};

const FormField: FC<FormQuestionProps> = ({ fieldId, formHook, onChange }) => {
  const { feedbackRequired, fieldByName } = useFieldsProvider();
  const field = fieldByName(fieldId);
  if (field == null) return null;

  const { control, formState } = formHook;
  const error = formState.errors?.[field.name] as FieldError;
  const sharedProps = useMemo(
    (): SharedFieldProps => ({
      error,
      name: field.name,
      label: field.label,
      required: field.validation?.required === true,
      placeholder: field.placeholder ?? undefined,
      description: field.description ?? undefined,
      formHook,
      control,
      onChangeCapture: onChange,
      feedbackRequired: feedbackRequired(field.name)
    }),
    [
      error,
      field.name,
      field.label,
      field.validation?.required,
      field.placeholder,
      field.description,
      formHook,
      control,
      onChange,
      feedbackRequired
    ]
  );

  return FormFieldFactories[field.inputType].renderInput(field, sharedProps);
};

export default FormField;
