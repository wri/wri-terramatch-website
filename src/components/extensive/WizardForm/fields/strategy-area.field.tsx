import * as yup from "yup";

import SelectAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/SelectAdditionalOptions";
import RHFStrategyAreaDataTable from "@/components/elements/Inputs/DataTable/RHFStrategyAreaDataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { toFormOptions } from "@/components/extensive/WizardForm/utils";

export const StrategyAreaField: FormFieldFactory = {
  createValidator: ({ validation }) => {
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

  renderInput: ({ collection, options, linkedFieldKey }, sharedProps) => (
    <RHFStrategyAreaDataTable
      {...sharedProps}
      collection={collection ?? ""}
      linkedFieldKey={linkedFieldKey ?? undefined}
      options={options ?? []}
    />
  ),

  getAnswer: ({ name, options }, formValues) => {
    const value = formValues[name];
    const parsedValue: { [key: string]: number }[] = JSON.parse(value);
    if (!Array.isArray(parsedValue)) return value;

    const formOptions = toFormOptions(options);
    return parsedValue
      .filter(entry => {
        const key = Object.keys(entry)[0];
        const percent = entry[key];
        return key && percent !== null && percent !== undefined && !isNaN(percent);
      })
      .map(entry => {
        const key = Object.keys(entry)[0];
        const percent = entry[key];
        const title = formOptions.find(o => o.value === key)?.title ?? key;

        return percent ? `${title} (${percent}%)` : `${title} (${percent})`;
      });
  },

  formBuilderAdditionalOptions: ({ field, getSource }) => <SelectAdditionalOptions {...{ field, getSource }} />,

  formBuilderDefaults: ({ optionListKey, collection }) => ({ optionsList: optionListKey, collection })
};
