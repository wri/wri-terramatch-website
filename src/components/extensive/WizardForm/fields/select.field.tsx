import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer, getHardcodedOptions, toFormOptions } from "@/components/extensive/WizardForm/utils";
import { findCachedGadmTitle } from "@/connections/Gadm";
import { selectQuestion, selectQuestions, selectSection, selectSections } from "@/connections/util/Form";
import { SELECT_FILTER_QUESTION } from "@/helpers/customForms";
import { isNotNull, toArray } from "@/utils/array";
import { selectValidation } from "@/utils/yup";

export const SelectField: FormFieldFactory = {
  createValidator: ({ validation, multiChoice }) => selectValidation(multiChoice, validation),

  renderInput: ({ optionsList, options, multiChoice, optionsOther, linkedFieldKey }, sharedProps) => (
    <RHFDropdown
      {...sharedProps}
      multiSelect={multiChoice}
      hasOtherOptions={optionsOther ?? false}
      options={options ?? undefined}
      optionsList={optionsList ?? undefined}
      linkedFieldKey={linkedFieldKey ?? undefined}
      enableAdditionalOptions
    />
  ),

  getAnswer: ({ name, options, optionsList, linkedFieldKey }, formValues) => {
    const value = formValues[name];

    if (options == null && optionsList?.startsWith("gadm-level-")) {
      // Pull titles for our values from the data api cache. If the title isn't found, return
      // the base value.
      const dropdownValues = toArray(value) as string[];
      return dropdownValues.map(value => {
        const level = Number(optionsList.slice(-1)) as 0 | 1 | 2;
        if (level === 0) return findCachedGadmTitle(level, value) ?? value;

        const filterLinkedKey = SELECT_FILTER_QUESTION[linkedFieldKey ?? ""];
        if (filterLinkedKey == null) return value;

        const { sectionId } = selectQuestion(name) ?? {};
        const { formId } = selectSection(sectionId ?? "") ?? {};
        for (const { uuid } of selectSections(formId ?? "")) {
          const question = selectQuestions(uuid).find(question => question.linkedFieldKey === filterLinkedKey);
          if (question == null) continue;

          const parentCodes = toArray(formValues?.[question.uuid]) as string[];
          return findCachedGadmTitle(level, value, parentCodes) ?? value;
        }

        return value;
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

  appendAnswers: (question, csv, values) => csv.pushRow([question.label, getFormattedAnswer(question, values)])
};
