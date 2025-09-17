import RHFDisturbanceTable from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { arrayValidation } from "@/utils/yup";

export const DisturbancesField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: ({ additionalProps }, sharedProps) => (
    <RHFDisturbanceTable
      {...sharedProps}
      hasExtent={additionalProps?.with_extent}
      hasIntensity={additionalProps?.with_intensity}
    />
  )
};
