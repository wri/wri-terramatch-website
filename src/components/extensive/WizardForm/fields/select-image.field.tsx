import RHFSelectImage from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { selectValidation } from "@/utils/yup";

export const SelectImageField: FormFieldFactory = {
  createValidator: ({ validation, multiChoice }) => selectValidation(multiChoice, validation),

  renderInput: ({ optionsList, multiChoice }, sharedProps) => (
    <RHFSelectImage {...sharedProps} multiSelect={multiChoice} optionsList={optionsList} />
  ),

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
