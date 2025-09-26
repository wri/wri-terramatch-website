import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { urlValidator } from "@/utils/yup";

export const UrlField: FormFieldFactory = {
  createValidator: urlValidator,

  renderInput: (field, sharedProps) => <Input {...sharedProps} type="url" />,

  appendAnswers: (field, csv, values, fieldsProvider) =>
    csv.pushRow([field.label, getFormattedAnswer(field, values, fieldsProvider)])
};
