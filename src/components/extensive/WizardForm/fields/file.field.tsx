import * as yup from "yup";

import RHFFileInput from "@/components/elements/Inputs/FileInput/RHFFileInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const FileField: FormFieldFactory = {
  createValidator: ({ validation, multiChoice }) => {
    if (multiChoice) {
      const validator = yup.array();
      return validation?.required === true ? validator.min(1).required() : validator;
    } else {
      const validator = yup.object();
      return validation?.required === true ? validator.required() : validator;
    }
  },

  renderInput: ({ additionalProps, collection, multiChoice }, sharedProps) => (
    <RHFFileInput
      {...sharedProps}
      isPhotosAndVideo={["photos", "videos"].includes(collection ?? "")}
      allowMultiple={multiChoice}
      collection={collection ?? ""}
      accept={additionalProps?.accept}
      maxFileSize={additionalProps?.max ?? 10}
      showPrivateCheckbox={additionalProps?.with_private_checkbox}
    />
  )
};
