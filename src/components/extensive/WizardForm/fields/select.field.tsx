import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { findCachedGadmTitle } from "@/connections/Gadm";
import { toArray } from "@/utils/array";
import { selectValidation } from "@/utils/yup";

export const SelectField: FormFieldFactory = {
  createValidator: ({ validation, multiChoice }) => selectValidation(multiChoice, validation),

  renderInput: ({ optionsList, multiChoice, optionsOther, linkedFieldKey }, sharedProps) => (
    <RHFDropdown
      {...sharedProps}
      multiSelect={multiChoice}
      hasOtherOptions={optionsOther ?? false}
      optionsList={optionsList}
      linkedFieldKey={linkedFieldKey}
      enableAdditionalOptions
    />
  ),

  getAnswer: ({ name, optionsList, linkedFieldKey }, formValues) => {
    // TODO clean this up
    const value = formValues[name];
    if (optionsList == null) return value;
    const { options, apiOptionsSource, optionsFilterFieldName } = field.fieldProps;
    if (options == null) {
      if (!apiOptionsSource?.startsWith("gadm-level-")) return value;

      // Pull titles for our values from the data api cache. If the title isn't found, return
      // the base value.
      const dropdownValues = toArray(value) as string[];
      return dropdownValues.map(value => {
        const level = Number(apiOptionsSource.slice(-1)) as 0 | 1 | 2;
        if (level === 0) return findCachedGadmTitle(level, value) ?? value;

        if (optionsFilterFieldName == null) return value;
        const parentCodes = toArray(formValues?.[optionsFilterFieldName]) as string[];
        return findCachedGadmTitle(level, value, parentCodes) ?? value;
      });
    } else if (Array.isArray(value)) {
      return (value.map(v => options.find(o => o.value === v)?.title).filter(title => !!title) as string[]) ?? value;
    } else {
      return options.find(o => o.value === value)?.title ?? value;
    }
  },

  appendAnswers: (question, csv, values) => csv.pushRow([question.label, getFormattedAnswer(question, values)])
};
