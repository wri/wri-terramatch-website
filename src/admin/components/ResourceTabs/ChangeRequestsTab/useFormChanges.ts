import { useT } from "@transifex/react";
import { isEqual } from "lodash";
import { useMemo } from "react";

import { getFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FieldInputType } from "@/components/extensive/WizardForm/types";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { formDefaultValues } from "@/helpers/customForms";
import { Entity } from "@/types/common";

interface FormChange {
  title?: string;
  inputType: FieldInputType;
  currentValue: any;
  newValue?: any;
}

export interface StepChange {
  stepTitle: string;
  changes: FormChange[];
}

const cleanValue = (value: any) => {
  if (typeof value === "string") {
    value = value.trim();

    if (value.length === 0) {
      value = null;
    }
  }

  return value;
};

export default function useFormChanges(
  fieldsProvider: FormFieldsProvider,
  current: any,
  changed: any,
  entity: Entity
): StepChange[] {
  const t = useT();
  const currentValues = useMemo(() => formDefaultValues(current, fieldsProvider), [current, fieldsProvider]);
  const changedValues = useMemo(() => formDefaultValues(changed, fieldsProvider), [changed, fieldsProvider]);
  return useMemo(
    () =>
      fieldsProvider.stepIds().map(stepId => {
        const currentEntries = getFormEntries(
          fieldsProvider,
          { values: currentValues, nullText: "-", stepId, entity },
          t
        );
        const changedEntries = getFormEntries(
          fieldsProvider,
          { values: changedValues, nullText: "-", stepId, entity },
          t
        );

        return {
          stepTitle: fieldsProvider.step(stepId)?.title ?? "",
          changes: changedEntries.map(entry => {
            const currentEntry = currentEntries.find(e => e.title === entry.title);
            const currentValue = cleanValue(currentEntry?.value) ?? "-";
            const newValue = cleanValue(entry.value) ?? "-";

            return {
              title: entry.title ?? "",
              inputType: entry.inputType,
              currentValue,
              newValue: isEqual(currentValue, newValue) ? undefined : newValue
            };
          })
        };
      }),
    [fieldsProvider, currentValues, entity, t, changedValues]
  );
}
