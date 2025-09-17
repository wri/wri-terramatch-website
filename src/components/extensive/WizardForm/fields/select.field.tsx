import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { selectValidation } from "@/utils/yup";

export const SelectField: FormFieldFactory = {
  createValidator: ({ validation, multiChoice }) => selectValidation(multiChoice, validation),
  renderInput: ({ optionsList, multiChoice, optionsOther, linkedFieldKey }, sharedProps) => (
    <RHFDropdown
      {...sharedProps}
      multiSelect={multiChoice}
      hasOtherOptions={optionsOther ?? undefined}
      optionsList={optionsList}
      linkedFieldKey={linkedFieldKey}
      enableAdditionalOptions
    />
  )
};
