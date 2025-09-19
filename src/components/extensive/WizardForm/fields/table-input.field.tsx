import RHFInputTable from "@/components/elements/Inputs/InputTable/RHFInputTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { selectChildQuestions } from "@/connections/util/Form";
import { objectValidation } from "@/utils/yup";

export const TableInputField: FormFieldFactory = {
  createValidator: ({ validation }) => objectValidation(validation),

  renderInput: ({ name, tableHeaders, additionalProps }, sharedProps) => (
    <RHFInputTable {...sharedProps} headers={tableHeaders} questionId={name} hasTotal={additionalProps?.with_numbers} />
  ),

  getAnswer: () => undefined,

  appendAnswers: ({ label, name, tableHeaders }, csv, formValues) => {
    csv.pushRow([label, tableHeaders?.[0]?.label ?? undefined, tableHeaders?.[1]?.label ?? undefined]);
    for (const row of selectChildQuestions(name)) {
      csv.pushRow(["", row.label, formValues[row.uuid] ?? ""]);
    }
  }
};
