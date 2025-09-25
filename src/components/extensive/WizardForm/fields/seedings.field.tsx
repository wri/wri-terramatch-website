import RHFSeedingTable, { getSeedingTableColumns } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import RHFSeedingTableInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers } from "@/components/extensive/WizardForm/utils";
import { arrayValidation } from "@/utils/yup";

export const SeedingsField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: ({ additionalProps, collection, model }, sharedProps) => {
    if (additionalProps?.capture_count === true) {
      return <RHFSeedingTableInput {...sharedProps} error={sharedProps.error as any} model={model!} withNumbers />;
    } else {
      return <RHFSeedingTable {...sharedProps} collection={collection ?? ""} captureCount={false} />;
    }
  },
  getAnswer: ({ name }, formValues) => formValues[name] as Answer,
  appendAnswers: ({ label, name, additionalProps }, csv, formValues) => {
    const headers = getSeedingTableColumns(undefined, additionalProps?.capture_count === true);
    appendTableAnswers(csv, label, headers, formValues[name]);
  }
};
