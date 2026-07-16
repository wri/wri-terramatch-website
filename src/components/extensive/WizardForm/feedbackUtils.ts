import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { valueWiseEqual } from "@/utils/valueWiseEqual";

const isFeedbackFieldInStep = (
  fieldName: string,
  fieldsProvider: FormFieldsProvider,
  feedbackFieldIds: string[] | null | undefined
): boolean => {
  const field = fieldsProvider.fieldByName(fieldName);
  return (
    (feedbackFieldIds?.includes(fieldName) ?? false) ||
    (field?.linkedFieldKey != null && (feedbackFieldIds?.includes(field.linkedFieldKey) ?? false))
  );
};

/** Top-level step fields plus conditional/table children (fieldNames excludes children). */
const fieldNamesInStepIncludingChildren = (fieldsProvider: FormFieldsProvider, stepId: string): string[] =>
  fieldsProvider.fieldNames(stepId).flatMap(fieldName => [fieldName, ...fieldsProvider.childNames(fieldName)]);

export const getFeedbackFieldNamesInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined
): string[] => {
  if (feedbackFieldIds == null || feedbackFieldIds.length === 0) return [];

  return fieldNamesInStepIncludingChildren(fieldsProvider, stepId).filter(fieldName =>
    isFeedbackFieldInStep(fieldName, fieldsProvider, feedbackFieldIds)
  );
};

export const isFeedbackFieldUnresolved = (
  fieldName: string,
  fieldsProvider: FormFieldsProvider,
  feedbackFieldIds: string[] | null | undefined,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined
): boolean => {
  if (!isFeedbackFieldInStep(fieldName, fieldsProvider, feedbackFieldIds)) return false;

  const childNames = fieldsProvider.childNames(fieldName);
  // Conditional (or other parent): editing a visible child also addresses the feedback.
  if (childNames.length > 0) {
    if (!valueWiseEqual(currentValues[fieldName], initialValues?.[fieldName])) return false;

    const parentValue = currentValues[fieldName];
    const childEdited = childNames.some(childName => {
      const child = fieldsProvider.fieldByName(childName);
      if (child == null || child.showOnParentCondition !== parentValue) return false;
      return !valueWiseEqual(currentValues[childName], initialValues?.[childName]);
    });
    return !childEdited;
  }

  return valueWiseEqual(currentValues[fieldName], initialValues?.[fieldName]);
};

export const hasUnresolvedFeedbackInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined
): boolean => {
  return getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds).some(fieldName =>
    isFeedbackFieldUnresolved(fieldName, fieldsProvider, feedbackFieldIds, currentValues, initialValues)
  );
};

export const countUnresolvedFeedbackInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined
): number => {
  return getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds).filter(fieldName =>
    isFeedbackFieldUnresolved(fieldName, fieldsProvider, feedbackFieldIds, currentValues, initialValues)
  ).length;
};

/** Whether the step still contains feedback fields flagged by a reviewer (read-only views). */
export const hasFeedbackInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined
) => getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds).length > 0;

/** Count of feedback fields in a step (read-only views). */
export const countFeedbackInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined
): number => getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds).length;
