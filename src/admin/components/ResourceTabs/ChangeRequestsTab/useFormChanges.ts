import { useT } from "@transifex/react";
import { useMemo } from "react";

import { getFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { normalizedFormDefaultValue } from "@/helpers/customForms";

interface FormChange {
  title?: string;
  type: FieldType;
  currentValue: any;
  newValue?: any;
}

export interface StepChange {
  step: FormStepSchema;
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

export default function useFormChanges(current: any, changed: any, steps: FormStepSchema[]): StepChange[] {
  const t = useT();
  const currentValues = useMemo(() => normalizedFormDefaultValue(current, steps), [current, steps]);
  const changedValues = useMemo(() => normalizedFormDefaultValue(changed, steps), [changed, steps]);
  return useMemo(
    () =>
      steps.map(step => {
        const currentEntries = getFormEntries({ values: currentValues, nullText: "-", step }, t);
        const changedEntries = getFormEntries({ values: changedValues, nullText: "-", step }, t);

        return {
          step,
          changes: changedEntries.map(entry => {
            const currentEntry = currentEntries.find(e => e.title === entry.title);
            const currentValue = cleanValue(currentEntry?.value) ?? "-";
            const newValue = cleanValue(entry.value) ?? "-";

            return {
              title: entry.title,
              type: entry.type,
              currentValue,
              newValue: currentValue === newValue ? undefined : newValue
            };
          })
        };
      }),
    [steps, t, currentValues, changedValues]
  );
}
