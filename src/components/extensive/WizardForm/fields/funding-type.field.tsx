import RHFFundingTypeDataTable, {
  getFundingTypeTableColumns
} from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { arrayValidation } from "@/utils/yup";

export const FundingTypeField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),

  renderInput: (field, sharedProps) => <RHFFundingTypeDataTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getFundingTypeTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  getEntryValue: (field, formValues, { t }) => dataTableEntryValue(getFundingTypeTableColumns(t), field, formValues)
};
