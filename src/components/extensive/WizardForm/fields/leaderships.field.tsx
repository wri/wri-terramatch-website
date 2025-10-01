import RHFLeadershipsDataTable, {
  getLeadershipsTableColumns
} from "@/components/elements/Inputs/DataTable/RHFLeadershipsTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { arrayValidator } from "@/utils/yup";

export const LeadershipsField: FormFieldFactory = {
  createValidator: arrayValidator,

  renderInput: ({ collection }, sharedProps) => (
    <RHFLeadershipsDataTable {...sharedProps} collection={collection ?? ""} />
  ),

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getLeadershipsTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  getEntryValue: (field, formValues, { t }) => dataTableEntryValue(getLeadershipsTableColumns(t), field, formValues)
};
