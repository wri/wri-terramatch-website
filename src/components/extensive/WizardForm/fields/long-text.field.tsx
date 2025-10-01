import * as yup from "yup";

import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const LongTextField: FormFieldFactory = {
  createValidator: ({ validation, minCharacterLimit, maxCharacterLimit }, t) => {
    let validator = yup.string();
    if (validation?.required === true) validator = validator.required();
    if (minCharacterLimit != null) {
      validator = validator.min(
        minCharacterLimit,
        t("Your answer does not meet the minimum required characters {minCharacterLimit} for this field.", {
          minCharacterLimit
        })
      );
    }
    if (maxCharacterLimit != null) {
      validator = validator.max(
        maxCharacterLimit,
        t(
          "Your answer length exceeds the maximum number of characters {maxCharacterLimit} allowed for this field. Please edit your answer to fit within the required number of characters for this field.",
          { maxCharacterLimit }
        )
      );
    }
    return validator;
  },

  renderInput: ({ minCharacterLimit, maxCharacterLimit }, sharedProps) => (
    <TextArea {...sharedProps} minLength={minCharacterLimit ?? undefined} maxLength={maxCharacterLimit ?? undefined} />
  )
};
