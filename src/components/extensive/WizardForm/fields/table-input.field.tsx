import { Dictionary } from "lodash";
import * as yup from "yup";

import TableAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/TableAdditionalOptions";
import RHFInputTable from "@/components/elements/Inputs/InputTable/RHFInputTable";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { addFieldValidation } from "@/components/extensive/WizardForm/utils";
import { isNotNull } from "@/utils/array";

export const TableInputField: FormFieldFactory = {
  addValidation: (validations, { name }, t, framework, fieldsProvider) => {
    validations[name] = yup.object(
      fieldsProvider
        .childNames(name)
        .map(fieldsProvider.fieldByName)
        .filter(isNotNull)
        .reduce((childSchema, { name: childName }) => {
          addFieldValidation(childSchema, fieldsProvider, childName, t, framework);
          return childSchema;
        }, {} as Dictionary<yup.AnySchema>)
    );
  },

  renderInput: ({ name, tableHeaders, additionalProps }, sharedProps) => (
    <RHFInputTable
      {...sharedProps}
      headers={tableHeaders ?? []}
      fieldId={name}
      hasTotal={additionalProps?.with_numbers}
    />
  ),

  getAnswer: () => undefined,

  appendAnswers: ({ label, name, tableHeaders }, csv, formValues, { childNames, fieldByName }) => {
    csv.pushRow([label, tableHeaders?.[0] ?? undefined, tableHeaders?.[1] ?? undefined]);
    for (const row of childNames(name).map(fieldByName).filter(isNotNull)) {
      csv.pushRow(["", row.label, formValues[row.name] ?? ""]);
    }
  },

  addFormEntries: addEntryWith(({ name }, formValues, { fieldsProvider: { childNames, fieldByName }, t }) =>
    childNames(name)
      .map(fieldByName)
      .filter(isNotNull)
      .map(row => `${row.label}: ${formValues[name]?.[row.name ?? ""] ?? t("Answer Not Provided")}`)
      .join("<br/>")
  ),

  defaultValue: ({ name }, formValues, { childNames, fieldByName }) => {
    const value = childNames(name)
      .map(fieldByName)
      .filter(isNotNull)
      .reduce((value, child) => ({ ...value, [child.name]: formValues[child.name] }), {});
    return { ...formValues, [name]: value };
  },

  normalizeValue: ({ name }, formValues) => {
    const { [name]: tableValues, ...rest } = formValues;
    return { ...rest, ...tableValues };
  },

  formBuilderAdditionalOptions: ({ linkedFieldsData, getSource }) => (
    <TableAdditionalOptions {...{ linkedFieldsData, getSource }} />
  ),

  formBuilderDefaults: () => ({
    tableHeaders: ["", ""]
  })
};
