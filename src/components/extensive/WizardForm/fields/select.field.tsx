import SelectAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/SelectAdditionalOptions";
import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getHardcodedOptions, toFormOptions } from "@/components/extensive/WizardForm/utils";
import { findCachedGadmTitle } from "@/connections/Gadm";
import { SELECT_FILTER_QUESTION } from "@/helpers/customForms";
import { isNotNull, toArray } from "@/utils/array";
import { addValidationWith, selectValidator } from "@/utils/yup";

export const SelectField: FormFieldFactory = {
  addValidation: addValidationWith(selectValidator),

  renderInput: ({ optionsList, options, multiChoice, optionsOther, linkedFieldKey }, sharedProps) => (
    <RHFDropdown
      {...sharedProps}
      multiSelect={multiChoice}
      hasOtherOptions={optionsOther ?? false}
      options={options ?? undefined}
      optionsList={optionsList ?? undefined}
      linkedFieldKey={linkedFieldKey ?? undefined}
      enableAdditionalOptions
      className={multiChoice ? "!h-auto min-h-[40px]" : undefined}
      titleContainerClassName={multiChoice ? "flex items-start gap-2 min-w-0" : undefined}
      titleClassname={multiChoice ? "!whitespace-normal !break-words" : undefined}
    />
  ),

  getAnswer: ({ name, options, optionsList, linkedFieldKey }, formValues, { fieldByKey }) => {
    const value = formValues[name];

    if (optionsList?.startsWith("gadm-level-")) {
      // Pull titles for our values from the data api cache. If the title isn't found, return
      // the base value.
      const dropdownValues = toArray(value) as string[];
      return dropdownValues.map(value => {
        const level = Number(optionsList.slice(-1)) as 0 | 1 | 2;
        if (level === 0) return findCachedGadmTitle(level, value) ?? value;

        const filterLinkedKey = SELECT_FILTER_QUESTION[linkedFieldKey ?? ""];
        if (filterLinkedKey == null) return value;

        const filterField = fieldByKey(filterLinkedKey);
        if (filterField == null) return value;

        const parentCodes = toArray(formValues?.[filterField.name]) as string[];
        return findCachedGadmTitle(level, value, parentCodes) ?? value;
      });
    }

    const formOptions =
      options == null && optionsList != null ? getHardcodedOptions(optionsList) : toFormOptions(options);
    if (Array.isArray(value)) {
      return value.map(v => formOptions.find(o => o.value === v)?.title).filter(isNotNull) ?? value;
    } else {
      return formOptions.find(o => o.value === value)?.title ?? value;
    }
  },

  formBuilderAdditionalOptions: ({ field, getSource }) => <SelectAdditionalOptions {...{ field, getSource }} />,

  formBuilderDefaults: ({ optionListKey, multiChoice }) => ({
    optionsList: optionListKey,
    multiChoice: multiChoice ?? undefined
  })
};
