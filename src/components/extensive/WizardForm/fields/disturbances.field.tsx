import { Dictionary } from "lodash";

import RHFDisturbanceTable, {
  getDisturbanceTableColumns
} from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { arrayValidator } from "@/utils/yup";

const props = (additionalProps?: Dictionary<any> | null) => ({
  hasExtent: additionalProps?.with_extent,
  hasIntensity: additionalProps?.with_intensity
});

export const DisturbancesField: FormFieldFactory = {
  createValidator: arrayValidator,

  renderInput: ({ additionalProps }, sharedProps) => (
    <RHFDisturbanceTable {...sharedProps} {...props(additionalProps)} />
  ),

  getAnswer: () => undefined,

  appendAnswers: ({ label, name, additionalProps }, csv, formValues) => {
    const headers = getDisturbanceTableColumns(props(additionalProps));
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  getEntryValue: (field, formValues, { t }) =>
    dataTableEntryValue(getDisturbanceTableColumns(props(field.additionalProps), t), field, formValues)
};
