import { useT } from "@transifex/react";
import { isEqual } from "lodash";
import { useMemo } from "react";

import { getFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { normalizedFormDefaultValue } from "@/helpers/customForms";
import { Entity } from "@/types/common";

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

export default function useFormChanges(
  current: any,
  changed: any,
  steps: FormStepSchema[],
  entity: Entity
): StepChange[] {
  const t = useT();
  const currentValues = useMemo(() => normalizedFormDefaultValue(current, steps), [current, steps]);
  const changedValues = useMemo(() => normalizedFormDefaultValue(changed, steps), [changed, steps]);
  return useMemo(
    () =>
      steps.map(step => {
        const currentEntries = getFormEntries({ values: currentValues, nullText: "-", step, entity }, t);
        const changedEntries = getFormEntries({ values: changedValues, nullText: "-", step, entity }, t);

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
              newValue: isEqual(currentValue, newValue) ? undefined : newValue
            };
          })
        };
      }),
    [steps, currentValues, entity, t, changedValues]
  );
}
