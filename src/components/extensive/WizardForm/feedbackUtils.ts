import { FormFieldsProvider } from "@/context/wizardForm.provider";

export const hasFeedbackInStep = (
  fieldsProvider: FormFieldsProvider,
  stepId: string,
  feedbackFieldIds: string[] | null | undefined
) => {
  if (feedbackFieldIds == null || feedbackFieldIds.length === 0) return false;

  return fieldsProvider.fieldNames(stepId).some(fieldName => {
    const field = fieldsProvider.fieldByName(fieldName);
    return (
      feedbackFieldIds.includes(fieldName) ||
      (field?.linkedFieldKey != null && feedbackFieldIds.includes(field.linkedFieldKey))
    );
  });
};
