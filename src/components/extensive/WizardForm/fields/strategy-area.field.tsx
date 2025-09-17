import * as yup from "yup";

import RHFStrategyAreaDataTable from "@/components/elements/Inputs/DataTable/RHFStrategyAreaDataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

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
  )
};
