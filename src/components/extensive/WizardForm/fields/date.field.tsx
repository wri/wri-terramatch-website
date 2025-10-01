import { parseDateValues } from "@/admin/apiProvider/utils/entryFormat";
import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { stringValidator } from "@/utils/yup";

export const DateField: FormFieldFactory = {
  createValidator: stringValidator,
  renderInput: (field, sharedProps) => <Input {...sharedProps} type="date" />,
  defaultValue: ({ name }, formValues) => ({ ...formValues, [name]: parseDateValues(formValues[name]) })
};
