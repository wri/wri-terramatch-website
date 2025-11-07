import { BooleanInput } from "react-admin";

import RHFSeedingTable, { getSeedingTableColumns } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import RHFSeedingTableInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import {
  appendTableAnswers,
  dataTableEntryValue,
  treeSpeciesEntryValue
} from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const SeedingsField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: ({ additionalProps, collection, model }, sharedProps) => {
    if (additionalProps?.capture_count === true) {
      return <RHFSeedingTableInput {...sharedProps} error={sharedProps.error as any} model={model!} withNumbers />;
    } else {
      return <RHFSeedingTable {...sharedProps} collection={collection ?? ""} captureCount={false} />;
    }
  },

  appendAnswers: ({ label, name, additionalProps }, csv, formValues) => {
    const headers = getSeedingTableColumns(undefined, additionalProps?.capture_count === true);
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  addFormEntries: addEntryWith((field, formValues, { t, entity, fieldsProvider }) => {
    if (field.additionalProps?.capture_count === true) {
      return treeSpeciesEntryValue("seeds", entity, field, formValues, fieldsProvider);
    } else {
      return dataTableEntryValue(getSeedingTableColumns(t, false), field, formValues);
    }
  }),

  formBuilderAdditionalOptions: ({ getSource }) => (
    <BooleanInput
      source={getSource("additionalProps.capture_count")}
      label="Capture Count"
      helperText="To allow users enter count instead of 'Number of seeds in sample' and 'Weight of sample(Kg)'"
      defaultValue={false}
    />
  ),

  formBuilderDefaults: ({ collection, formModelType }) => ({ collection, model: formModelType })
};
