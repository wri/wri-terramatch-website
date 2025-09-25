import * as yup from "yup";

import RHFTreeSpeciesInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const TreeSpeciesField: FormFieldFactory = {
  createValidator: ({ additionalProps, validation }) => {
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
  },

  renderInput: ({ additionalProps, collection, model }, sharedProps) => (
    <RHFTreeSpeciesInput
      {...sharedProps}
      error={sharedProps.error as any}
      withNumbers={additionalProps?.with_numbers}
      collection={collection ?? ""}
      model={model!}
    />
  ),

  getAnswer: ({ name }, formValues) => formValues[name] as Answer,

  appendAnswers: (question, csv, formValues) => {
    const value = ((TreeSpeciesField.getAnswer(question, formValues) ?? []) as TreeSpeciesValue[]).filter(
      v => v != null
    );
    if (value.length > 0) {
      if (question.additionalProps?.with_numbers === true) {
        csv.pushRow([question.label, "Species name", "Total Trees"]);
        for (const { name, amount } of value) {
          csv.pushRow(["", name, amount]);
        }
      } else {
        csv.pushRow([question.label, "Species name"]);
        for (const { name } of value) {
          csv.pushRow(["", name]);
        }
      }
    }
  }
};
