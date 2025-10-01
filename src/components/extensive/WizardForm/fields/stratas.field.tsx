import RHFStrataTable, { getStrataTableColumns } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { arrayValidator } from "@/utils/yup";

export const StratasField: FormFieldFactory = {
  createValidator: arrayValidator,

  renderInput: (field, sharedProps) => <RHFStrataTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getStrataTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  getEntryValue: (field, formValues, { t }) => dataTableEntryValue(getStrataTableColumns(t), field, formValues)
};
