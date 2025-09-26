import RHFStrataTable, { getStrataTableColumns } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers } from "@/components/extensive/WizardForm/utils";
import { arrayValidation } from "@/utils/yup";

export const StratasField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: (field, sharedProps) => <RHFStrataTable {...sharedProps} />,
  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getStrataTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  }
};
