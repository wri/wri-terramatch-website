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

const findParentFieldName = (fieldName: string, fieldsProvider: FormFieldsProvider): string | undefined => {
  for (const stepId of fieldsProvider.stepIds()) {
    for (const parentName of fieldsProvider.fieldNames(stepId)) {
      if (fieldsProvider.childNames(parentName).includes(fieldName)) {
        return parentName;
      }
    }
  }

  return undefined;
};

/** Conditional children are only visible when the parent answer matches showOnParentCondition. */
export const isFeedbackFieldVisible = (
  fieldName: string,
  fieldsProvider: FormFieldsProvider,
  currentValues: Record<string, unknown>
): boolean => {
  const parentName = findParentFieldName(fieldName, fieldsProvider);
  if (parentName == null) return true;

  const child = fieldsProvider.fieldByName(fieldName);
  return child?.showOnParentCondition === currentValues[parentName];
};

/** Top-level step fields plus conditional/table children (fieldNames excludes children). */
const fieldNamesInStepIncludingChildren = (fieldsProvider: FormFieldsProvider, stepId: string): string[] =>
  fieldsProvider.fieldNames(stepId).flatMap(fieldName => [fieldName, ...fieldsProvider.childNames(fieldName)]);

export const getFeedbackFieldNamesInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined,
  currentValues?: Record<string, unknown>
): string[] => {
  if (feedbackFieldIds == null || feedbackFieldIds.length === 0) return [];

  const feedbackFieldNames = fieldNamesInStepIncludingChildren(fieldsProvider, stepId).filter(fieldName =>
    isFeedbackFieldInStep(fieldName, fieldsProvider, feedbackFieldIds)
  );

  if (currentValues == null) return feedbackFieldNames;

  return feedbackFieldNames.filter(fieldName => isFeedbackFieldVisible(fieldName, fieldsProvider, currentValues));
};

export const isFeedbackFieldEdited = (
  fieldName: string,
  fieldsProvider: FormFieldsProvider,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined
): boolean => {
  const childNames = fieldsProvider.childNames(fieldName);
  // Conditional (or other parent): editing a visible child also addresses the feedback.
  if (childNames.length > 0) {
    if (!valueWiseEqual(currentValues[fieldName], initialValues?.[fieldName])) return true;

    const parentValue = currentValues[fieldName];
    return childNames.some(childName => {
      const child = fieldsProvider.fieldByName(childName);
      if (child == null || child.showOnParentCondition !== parentValue) return false;
      return !valueWiseEqual(currentValues[childName], initialValues?.[childName]);
    });
  }

  return !valueWiseEqual(currentValues[fieldName], initialValues?.[fieldName]);
};

const hasAnyEditedFeedbackFieldInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined
): boolean =>
  getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds, currentValues).some(fieldName =>
    isFeedbackFieldEdited(fieldName, fieldsProvider, currentValues, initialValues)
  );

export const isFeedbackFieldUnresolved = (
  fieldName: string,
  fieldsProvider: FormFieldsProvider,
  feedbackFieldIds: string[] | null | undefined,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined,
  stepId?: string
): boolean => {
  if (!isFeedbackFieldInStep(fieldName, fieldsProvider, feedbackFieldIds)) return false;
  if (!isFeedbackFieldVisible(fieldName, fieldsProvider, currentValues)) return false;

  // When the admin flags multiple fields in a section, editing any visible one addresses the section.
  if (stepId != null) {
    const feedbackFieldNames = getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds, currentValues);
    if (!feedbackFieldNames.includes(fieldName)) return false;

    return !hasAnyEditedFeedbackFieldInStep(fieldsProvider, stepId, feedbackFieldIds, currentValues, initialValues);
  }

  return !isFeedbackFieldEdited(fieldName, fieldsProvider, currentValues, initialValues);
};

export const isFieldFeedbackRequiringAttention = (
  fieldName: string,
  fieldsProvider: FormFieldsProvider,
  feedbackFieldIds: string[] | null | undefined,
  currentValues?: Record<string, unknown>,
  initialValues?: Record<string, unknown>,
  stepId?: string
): boolean => {
  if (initialValues != null) {
    return isFeedbackFieldUnresolved(
      fieldName,
      fieldsProvider,
      feedbackFieldIds,
      currentValues ?? {},
      initialValues,
      stepId
    );
  }

  return isFeedbackFieldInStep(fieldName, fieldsProvider, feedbackFieldIds);
};

export const hasUnresolvedFeedbackInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined
): boolean => {
  const feedbackFieldNames = getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds, currentValues);
  if (feedbackFieldNames.length === 0) return false;

  return !hasAnyEditedFeedbackFieldInStep(fieldsProvider, stepId, feedbackFieldIds, currentValues, initialValues);
};

export const countUnresolvedFeedbackInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined,
  currentValues: Record<string, unknown>,
  initialValues: Record<string, unknown> | undefined
): number => {
  const feedbackFieldNames = getFeedbackFieldNamesInStep(fieldsProvider, stepId, feedbackFieldIds, currentValues);
  if (feedbackFieldNames.length === 0) return 0;

  return hasAnyEditedFeedbackFieldInStep(fieldsProvider, stepId, feedbackFieldIds, currentValues, initialValues)
    ? 0
    : feedbackFieldNames.length;
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
