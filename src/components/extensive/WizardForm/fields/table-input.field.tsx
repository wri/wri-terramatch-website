import RHFInputTable from "@/components/elements/Inputs/InputTable/RHFInputTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { isNotNull } from "@/utils/array";
import { objectValidator } from "@/utils/yup";

export const TableInputField: FormFieldFactory = {
  createValidator: objectValidator,

  renderInput: ({ name, tableHeaders, additionalProps }, sharedProps) => (
    <RHFInputTable
      {...sharedProps}
      headers={tableHeaders ?? []}
      fieldId={name}
      hasTotal={additionalProps?.with_numbers}
    />
  ),

  getAnswer: () => undefined,

  appendAnswers: ({ label, name, tableHeaders }, csv, formValues, { childIds, fieldById }) => {
    csv.pushRow([label, tableHeaders?.[0]?.label ?? undefined, tableHeaders?.[1]?.label ?? undefined]);
    for (const row of childIds(name).map(fieldById).filter(isNotNull)) {
      csv.pushRow(["", row.label, formValues[row.name] ?? ""]);
    }
  },

  getEntryValue: ({ name }, formValues, { fieldsProvider: { childIds, fieldById }, t }) =>
    childIds(name)
      .map(fieldById)
      .filter(isNotNull)
      .map(row => `${row.label}: ${formValues[name]?.[row.name ?? ""] ?? t("Answer Not Provided")}`)
      .join("<br/>"),

  defaultValue: ({ name }, formValues, { childIds, fieldById }) => {
    const value = childIds(name)
      .map(fieldById)
      .filter(isNotNull)
      .reduce((value, child) => ({ ...value, [child.name]: formValues[child.name] }), {});
    return { ...formValues, [name]: value };
  },

  normalizeValue: ({ name }, formValues) => {
    const { [name]: tableValues, ...rest } = formValues;
    return { ...rest, ...tableValues };
  }
};
