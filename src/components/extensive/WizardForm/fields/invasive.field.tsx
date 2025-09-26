import RHFInvasiveTable, { getInvasiveTableColumns } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { arrayValidation } from "@/utils/yup";

export const InvasiveField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),

  renderInput: (field, sharedProps) => <RHFInvasiveTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getInvasiveTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  getEntryValue: (field, formValues, { t }) => dataTableEntryValue(getInvasiveTableColumns(t), field, formValues)
};
