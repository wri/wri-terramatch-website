import RHFFundingTypeDataTable from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { arrayValidation } from "@/utils/yup";

export const FundingTypeField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: (question, sharedProps) => <RHFFundingTypeDataTable {...sharedProps} />
};
