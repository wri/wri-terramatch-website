import RHFSelect from "@/components/elements/Inputs/Select/RHFSelect";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { stringValidation } from "@/utils/yup";

export const RadioField: FormFieldFactory = {
  createValidator: ({ validation }) => stringValidation(validation),
  renderInput: ({ optionsList }, sharedProps) => <RHFSelect {...sharedProps} optionsList={optionsList} />,
  getAnswer: ({ name, options }, formValues) => {
    const value = formValues[name];
    if (Array.isArray(value)) {
      return (value.map(v => options.find(o => o.value === v)?.title).filter(title => !!title) as string[]) ?? value;
    } else {
      return options.find(o => o.value === value)?.title ?? value;
    }
  },
  appendAnswers: (question, csv, values) => csv.pushRow([question.label, getFormattedAnswer(question, values)])
};
