import * as yup from "yup";

import RHFFileInput from "@/components/elements/Inputs/FileInput/RHFFileInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";

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

  renderInput: ({ additionalProps, collection, multiChoice, model }, sharedProps) => (
    <RHFFileInput
      {...sharedProps}
      model={model!}
      isPhotosAndVideo={["photos", "videos"].includes(collection ?? "")}
      allowMultiple={multiChoice}
      collection={collection ?? ""}
      accept={additionalProps?.accept}
      maxFileSize={additionalProps?.max ?? 10}
      showPrivateCheckbox={additionalProps?.with_private_checkbox}
    />
  ),

  getAnswer: ({ name }, formValues) => toArray(formValues[name]),

  appendAnswers: (question, csv, values) => {
    const value = (FileField.getAnswer(question, values) as UploadedFile[]).filter(v => v != null);
    if (value.length > 0) {
      csv.pushRow([question.label, "FileName", "File Url"]);

      value.forEach(v => {
        csv.pushRow(["", v.title ?? v.file_name ?? "", v.url]);
      });
    }
  }
};
