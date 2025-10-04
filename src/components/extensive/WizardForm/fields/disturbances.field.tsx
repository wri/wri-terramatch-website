import { Dictionary } from "lodash";
import { BooleanInput } from "react-admin";

import RHFDisturbanceTable, {
  getDisturbanceTableColumns
} from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

const props = (additionalProps?: Dictionary<any> | null) => ({
  hasExtent: additionalProps?.with_extent,
  hasIntensity: additionalProps?.with_intensity
});

export const DisturbancesField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: ({ additionalProps }, sharedProps) => (
    <RHFDisturbanceTable {...sharedProps} {...props(additionalProps)} />
  ),

  getAnswer: () => undefined,

  appendAnswers: ({ label, name, additionalProps }, csv, formValues) => {
    const { with_intensity: hasIntensity, with_extent: hasExtent } = additionalProps ?? {};
    const headers = getDisturbanceTableColumns(hasIntensity, hasExtent);
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  addFormEntries: addEntryWith((field, formValues, { t }) =>
    dataTableEntryValue(
      getDisturbanceTableColumns(field.additionalProps?.with_intensity, field.additionalProps?.with_extent, t),
      field,
      formValues
    )
  ),

  formBuilderAdditionalOptions: ({ getSource }) => (
    <>
      <BooleanInput
        source={getSource("additionalProps.with_intensity")}
        label="Has intensity"
        helperText="When enabled, this will prompt users to specify the intensity of the disturbance, which can be categorized as low, medium, or high."
        defaultValue={false}
      />
      <BooleanInput
        source={getSource("additionalProps.with_extent")}
        label="Has extent (% of site affected)"
        helperText="When enabled, this will prompt users to indicate the extent of the disturbance. Users can choose from the following ranges: 0 - 20%, 21 - 40%, 41 - 60%, 61 - 80%, or 81 - 100%."
        defaultValue={false}
      />
    </>
  )
};
