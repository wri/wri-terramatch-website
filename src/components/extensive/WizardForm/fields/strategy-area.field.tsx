import * as yup from "yup";

import RHFStrategyAreaDataTable from "@/components/elements/Inputs/DataTable/RHFStrategyAreaDataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";

export const StrategyAreaField: FormFieldFactory = {
  createValidator: ({ validation }, t, framework) => {
    const validator = yup.string().test("total-percentage", function (value) {
      try {
        const parsed = JSON.parse(value ?? "[]");
        if (!Array.isArray(parsed)) return true;

        const hasValues = parsed.some((item: { [key: string]: number }) => Object.values(item)[0] > 0);
        if (!hasValues) return true;

        const total = parsed.reduce((sum: number, item: { [key: string]: number }) => sum + Object.values(item)[0], 0);

        if (total > 100) {
          return this.createError({
            message: "Your total exceeds 100%. Please adjust your percentages to equal 100 and then save & continue."
          });
        }

        if (total < 100) {
          return this.createError({
            message: "Your total is under 100%. Please adjust your percentages to equal 100 and then save & continue."
          });
        }

        return true;
      } catch {
        return this.createError({ message: "There was a problem validating this field." });
      }
    });

    return validation?.required === true ? validator.required() : validator;
  },

  renderInput: ({ collection, optionsList, optionsOther, linkedFieldKey }, sharedProps) => (
    <RHFStrategyAreaDataTable
      {...sharedProps}
      collection={collection ?? ""}
      optionsList={optionsList}
      linkedFieldKey={linkedFieldKey}
      hasOtherOptions={optionsOther}
    />
  ),

  getAnswer: ({ name, options }, formValues) => {
    const value = formValues[name];
    const parsedValue: { [key: string]: number }[] = JSON.parse(value);

    if (Array.isArray(parsedValue)) {
      const formatted = parsedValue
        .filter(entry => {
          const key = Object.keys(entry)[0];
          const percent = entry[key];
          return key && percent !== null && percent !== undefined && !isNaN(percent);
        })
        .map(entry => {
          const key = Object.keys(entry)[0];
          const percent = entry[key];
          const title = options.find(o => o.value === key)?.title || key;

          return percent ? `${title} (${percent}%)` : `${title} (${percent})`;
        });

      return formatted;
    }

    return value;
  },

  appendAnswers: (question, csv, values) => csv.pushRow([question.label, getFormattedAnswer(question, values)])
};
