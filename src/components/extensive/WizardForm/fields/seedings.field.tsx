import RHFSeedingTable from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import RHFSeedingTableInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { arrayValidation } from "@/utils/yup";

export const SeedingsField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: ({ additionalProps, collection }, sharedProps) => {
    if (additionalProps?.capture_count === true) {
      return <RHFSeedingTableInput {...sharedProps} withNumbers />;
    } else {
      return <RHFSeedingTable {...sharedProps} collection={collection ?? ""} captureCount={false} />;
    }
  }
};
