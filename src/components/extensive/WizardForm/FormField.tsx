import { FC, useMemo } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";

import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { FieldDefinition, SharedFieldProps } from "@/components/extensive/WizardForm/types";

type FormQuestionProps = {
  field: FieldDefinition;
  formHook: UseFormReturn;
  onChange: () => void;
  formSubmissionOrg?: any;
};

const FormField: FC<FormQuestionProps> = ({ field, formHook, onChange, formSubmissionOrg }) => {
  const sharedProps = useMemo(
    (): SharedFieldProps => ({
      error: formHook.formState.errors?.[field.name] as FieldError,
      name: field.name,
      label: field.label,
      required: field.validation?.required === true,
      placeholder: field.placeholder ?? undefined,
      description: field.description ?? undefined,
      formHook,
      control: formHook.control,
      onChangeCapture: onChange
    }),
    [formHook, onChange, field]
  );

  const { inputType } = field;

  return FormFieldFactories[inputType].renderInput(field, sharedProps);
};

export default FormField;
