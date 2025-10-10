import { BooleanInput } from "react-admin";
import * as yup from "yup";

import RHFTreeSpeciesInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getAnswer, treeSpeciesEntryValue } from "@/components/extensive/WizardForm/utils";
import { isNotNull } from "@/utils/array";
import { addValidationWith } from "@/utils/yup";

export const TreeSpeciesField: FormFieldFactory = {
  addValidation: addValidationWith(({ additionalProps, validation }) => {
    const arrayItemShape =
      additionalProps?.with_numbers === true
        ? yup.object({
            name: yup.string().required(),
            amount: yup.number().min(0).required()
          })
        : yup.object({
            name: yup.string().required()
          });

    const validator = yup.array(arrayItemShape);
    return validation?.required === true ? validator.required() : validator;
  }),

  renderInput: ({ additionalProps, collection, model }, sharedProps) => (
    <RHFTreeSpeciesInput
      {...sharedProps}
      error={sharedProps.error as any}
      withNumbers={additionalProps?.with_numbers}
      collection={collection ?? ""}
      model={model!}
    />
  ),

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

  addFormEntries: addEntryWith((field, formValues, { entity, fieldsProvider }) => {
    const value = (getAnswer(field, formValues, fieldsProvider) ?? []) as TreeSpeciesValue[];
    const collection = value[0]?.collection;
    return treeSpeciesEntryValue(collection, entity, field, formValues, fieldsProvider);
  }),

  formBuilderAdditionalOptions: ({ getSource }) => (
    <BooleanInput
      source={getSource("additionalProps.with_numbers")}
      label="Has Count"
      helperText="To allow users enter count for each tree species record."
      defaultValue={false}
    />
  )
};
