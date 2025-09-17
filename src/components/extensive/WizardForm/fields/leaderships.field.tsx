import RHFLeadershipsDataTable from "@/components/elements/Inputs/DataTable/RHFLeadershipsTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { arrayValidation } from "@/utils/yup";

export const LeadershipsField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: ({ collection }, sharedProps) => (
    <RHFLeadershipsDataTable {...sharedProps} collection={collection ?? ""} />
  )
};
