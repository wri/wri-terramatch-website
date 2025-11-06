import { maxValue, minValue, NumberInput } from "react-admin";
import * as yup from "yup";

import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { addValidationWith } from "@/utils/yup";

export const LongTextField: FormFieldFactory = {
  addValidation: addValidationWith(({ minCharacterLimit, maxCharacterLimit }, t) => {
    let validator = yup.string();
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
  }),

  renderInput: ({ minCharacterLimit, maxCharacterLimit }, sharedProps) => (
    <TextArea {...sharedProps} minLength={minCharacterLimit ?? undefined} maxLength={maxCharacterLimit ?? undefined} />
  ),

  formBuilderAdditionalOptions: ({ getSource }) => (
    <>
      <NumberInput
        source={getSource("minCharacterLimit")}
        label="Minimum Character Limit"
        defaultValue={0}
        validate={[minValue(0)]}
      />
      <NumberInput
        source={getSource("maxCharacterLimit")}
        label="Maximum Character Limit"
        defaultValue={90000}
        validate={[maxValue(90000)]}
      />
    </>
  )
};
