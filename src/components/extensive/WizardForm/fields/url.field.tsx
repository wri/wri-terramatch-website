import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { urlValidator } from "@/utils/yup";

export const UrlField: FormFieldFactory = {
  createValidator: urlValidator,
  renderInput: (field, sharedProps) => <Input {...sharedProps} type="url" />
};
