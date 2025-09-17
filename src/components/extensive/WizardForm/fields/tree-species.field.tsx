import * as yup from "yup";

import RHFTreeSpeciesInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

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

  renderInput: ({ additionalProps, collection }, sharedProps) => (
    <RHFTreeSpeciesInput
      {...sharedProps}
      error={sharedProps.error as any}
      withNumbers={additionalProps?.with_numbers}
      collection={collection ?? ""}
    />
  )
};
