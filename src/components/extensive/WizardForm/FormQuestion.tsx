import { FC, useMemo } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";

import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { selectQuestion } from "@/connections/util/Form";

type FormQuestionProps = {
  questionId: string;
  formHook: UseFormReturn;
  onChange: () => void;
  formSubmissionOrg?: any;
};

const FormQuestion: FC<FormQuestionProps> = ({ questionId, formHook, onChange, formSubmissionOrg }) => {
  const questionData = useMemo(() => {
    const question = selectQuestion(questionId);
    if (question == null) return null;

    const sharedProps = {
      error: formHook.formState.errors?.[question.uuid] as FieldError,
      name: question.uuid,
      label: question.label,
      required: question.validation?.required === true,
      placeholder: question.placeholder ?? undefined,
      description: question.description ?? undefined,
      formHook,
      control: formHook.control,
      onChangeCapture: onChange
    };

    return { question, sharedProps };
  }, [formHook, onChange, questionId]);
  if (questionData == null) return null;

  const { question, sharedProps } = questionData;
  const { inputType } = question;

  return FormFieldFactories[inputType].renderInput(question, sharedProps);
};

export default FormQuestion;
