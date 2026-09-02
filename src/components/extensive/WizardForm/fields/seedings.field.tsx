import { BooleanInput } from "react-admin";

import RHFSeedingTable, {
  getSeedingTableColumns,
  getSeedsPerKg,
  SeedingEntry
} from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import RHFSeedingTableInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import SeedingsEntryValue from "@/components/extensive/WizardForm/SeedingsEntryValue";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers } from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const SeedingsField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: ({ additionalProps, collection, model }, sharedProps) => {
    if (additionalProps?.capture_count === true) {
      return <RHFSeedingTableInput {...sharedProps} error={sharedProps.error} model={model!} withNumbers />;
    } else {
      return <RHFSeedingTable {...sharedProps} collection={collection ?? ""} captureCount={false} />;
    }
  },

  appendAnswers: ({ label, name, additionalProps }, csv, formValues) => {
    const captureCount = additionalProps?.capture_count === true;
    const headers = getSeedingTableColumns(undefined, captureCount);
    const entries = (formValues[name] ?? []).map((entry: SeedingEntry) =>
      captureCount ? entry : { ...entry, seedsPerKg: getSeedsPerKg(entry) }
    );
    appendTableAnswers(csv, label, headers, entries);
  },

  addFormEntries: addEntryWith((field, formValues, { fieldsProvider }) => (
    <SeedingsEntryValue {...{ field, values: formValues, fieldsProvider }} />
  )),

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
