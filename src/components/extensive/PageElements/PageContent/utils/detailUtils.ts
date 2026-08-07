import * as yup from "yup";

import { isFieldFeedbackRequiringAttention } from "@/components/extensive/WizardForm/feedbackUtils";
import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import Log from "@/utils/log";

export type EntryInlineIssueKind = "required" | "feedback" | "totals-match";

export type EntryInlineIssue = {
  kind: EntryInlineIssueKind;
};

export const getValidationErrorsByField = (
  validation: yup.ObjectSchema<Record<string, unknown>>,
  values: Record<string, unknown>
): Map<string, yup.ValidationError[]> => {
  const errorsByField = new Map<string, yup.ValidationError[]>();

  try {
    validation.validateSync(values, { abortEarly: false });
  } catch (err: unknown) {
    if (!(err instanceof yup.ValidationError)) return errorsByField;

    const errors = err.inner.length > 0 ? err.inner : [err];
    for (const error of errors) {
      const fieldName = error.path?.split(".")[0];
      if (fieldName == null || fieldName === "") continue;

      const fieldErrors = errorsByField.get(fieldName) ?? [];
      fieldErrors.push(error);
      errorsByField.set(fieldName, fieldErrors);
    }
  }

  return errorsByField;
};

export const countValidationErrors = (errorsByField: Map<string, yup.ValidationError[]>): number => {
  let count = 0;
  for (const fieldErrors of errorsByField.values()) {
    count += fieldErrors.length;
  }
  return count;
};

export const getFieldsRequiringAttentionCount = (
  validation: yup.ObjectSchema<Record<string, unknown>>,
  values: Record<string, unknown> | undefined
): number => {
  if (values == null) return 0;
  return countValidationErrors(getValidationErrorsByField(validation, values));
};

const isEmptyFieldValue = (value: unknown): boolean =>
  value == null || value === "" || (Array.isArray(value) && value.length === 0);

const isRequiredValidationError = (error: yup.ValidationError, value: unknown): boolean =>
  error.type === "required" || (error.type === "min" && isEmptyFieldValue(value));

export const resolveEntryInlineIssue = ({
  entry,
  formValues,
  validationErrorsByField,
  fieldsProvider,
  feedbackFieldIds,
  feedbackBaselineValues
}: {
  entry: FormEntry;
  formValues: Record<string, unknown>;
  validationErrorsByField: Map<string, yup.ValidationError[]>;
  fieldsProvider: FormFieldsProvider;
  feedbackFieldIds?: string[] | null;
  feedbackBaselineValues?: Record<string, unknown>;
}): EntryInlineIssue | null => {
  if (entry.name == null) {
    return null;
  }

  if (
    isFieldFeedbackRequiringAttention(entry.name, fieldsProvider, feedbackFieldIds, formValues, feedbackBaselineValues)
  ) {
    return { kind: "feedback" };
  }

  const fieldErrors = validationErrorsByField.get(entry.name) ?? [];
  if (fieldErrors.length === 0) {
    return null;
  }

  if (fieldErrors.some(error => error.type === "totals-match")) {
    return { kind: "totals-match" };
  }

  const fieldValue = formValues[entry.name];
  if (fieldErrors.some(error => isRequiredValidationError(error, fieldValue))) {
    return { kind: "required" };
  }

  Log.warn("Unhandled details entry validation error", {
    entryName: entry.name,
    entryTitle: entry.title,
    inputType: entry.inputType,
    errors: fieldErrors.map(error => ({
      type: error.type,
      path: error.path,
      message: error.message
    }))
  });

  return null;
};

export function plantsToNoCountRows(
  plants: Array<{ name?: string | null }>,
  speciesPerRow: number
): Array<Record<number, string> & { id: number }> {
  const rows: Array<Record<number, string> & { id: number }> = [];
  for (let i = 0; i < plants.length; i += speciesPerRow) {
    const row: Record<number, string> & { id: number } = {
      id: Math.floor(i / speciesPerRow) + 1
    };
    for (let j = 0; j < speciesPerRow; j++) {
      row[j + 1] = plants[i + j]?.name ?? "";
    }
    rows.push(row);
  }
  return rows;
}
