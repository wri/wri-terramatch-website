import { BooleanInput } from "react-admin";
import * as yup from "yup";

import RHFTreeSpeciesInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import TreeSpeciesEntryValue from "@/components/extensive/WizardForm/TreeSpeciesEntryValue";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getAnswer } from "@/components/extensive/WizardForm/utils";
import { isNotNull } from "@/utils/array";
import { addValidationWith } from "@/utils/yup";

function resolveTreeSpeciesFormCollection(
  collection: string | null | undefined,
  linkedFieldKey: string | null | undefined
): string {
  if (collection != null && String(collection).trim() !== "") {
    return collection;
  }
  if (linkedFieldKey === "site-rep-rel-anr-tree-species") {
    return "anr";
  }
  if (linkedFieldKey === "site-rep-rel-invasive-tree-species") {
    return "invasive";
  }
  return "";
}

export const TreeSpeciesField: FormFieldFactory = {
  addValidation: addValidationWith(({ additionalProps, validation }) => {
    const validator = yup.array(
      additionalProps?.with_numbers === true
        ? yup.object({
            name: yup.string().required(),
            amount: yup.number().min(0).required()
          })
        : yup.object({
            name: yup.string().required()
          })
    );
    return validation?.required === true ? validator.min(1) : validator;
  }),

  renderInput: ({ additionalProps, collection, linkedFieldKey, model }, sharedProps) => (
    <RHFTreeSpeciesInput
      {...sharedProps}
      error={sharedProps.error}
      withNumbers={additionalProps?.with_numbers}
      collection={resolveTreeSpeciesFormCollection(collection, linkedFieldKey)}
      model={model!}
    />
  ),

  normalizeValue: ({ name }, formValues) => {
    if (formValues[name] == null) {
      return { ...formValues, [name]: [] };
    }
    return formValues;
  },

  appendAnswers: (field, csv, formValues, fieldsProvider) => {
    const value = ((getAnswer(field, formValues, fieldsProvider) ?? []) as TreeSpeciesValue[]).filter(isNotNull);
    if (value.length > 0) {
      if (field.additionalProps?.with_numbers === true) {
        csv.pushRow([field.label, "Species name", "Total Trees"]);
        for (const { name, amount } of value) {
          csv.pushRow(["", name, amount]);
        }
      } else {
        csv.pushRow([field.label, "Species name"]);
        for (const { name } of value) {
          csv.pushRow(["", name]);
        }
      }
    }
  },

  addFormEntries: addEntryWith((field, values, { fieldsProvider }) => (
    <TreeSpeciesEntryValue {...{ field, values, fieldsProvider }} />
  )),

  formBuilderAdditionalOptions: ({ getSource }) => (
    <BooleanInput
      source={getSource("additionalProps.with_numbers")}
      label="Has Count"
      helperText="To allow users enter count for each tree species record."
      defaultValue={false}
    />
  ),

  formBuilderDefaults: ({ collection, formModelType }) => ({ collection, model: formModelType })
};
