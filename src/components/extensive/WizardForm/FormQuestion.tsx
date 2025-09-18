import { FC, useMemo } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";

import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { QuestionDefinition, SharedFieldProps } from "@/components/extensive/WizardForm/types";

type FormQuestionProps = {
  question: QuestionDefinition;
  formHook: UseFormReturn;
  onChange: () => void;
  formSubmissionOrg?: any;
};

const FormQuestion: FC<FormQuestionProps> = ({ question, formHook, onChange, formSubmissionOrg }) => {
  const sharedProps = useMemo(
    (): SharedFieldProps => ({
      error: formHook.formState.errors?.[question.name] as FieldError,
      name: question.name,
      label: question.label,
      required: question.validation?.required === true,
      placeholder: question.placeholder ?? undefined,
      description: question.description ?? undefined,
      formHook,
      control: formHook.control,
      onChangeCapture: onChange
    }),
    [formHook, onChange, question]
  );

  const { inputType } = question;

  return FormFieldFactories[inputType].renderInput(question, sharedProps);
};

export default FormQuestion;
