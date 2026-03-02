import { BooleanInput } from "react-admin";
import * as yup from "yup";

import RHFFileInput from "@/components/elements/Inputs/FileInput/RHFFileInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getAnswer } from "@/components/extensive/WizardForm/utils";
import { FileType, UploadedFile } from "@/types/common";
import { isNotNull } from "@/utils/array";
import { addValidationWith } from "@/utils/yup";

/** Collections validated as general-documents (max 5MB, standard file types) */
const isGeneralDocumentCollection = (c: string | null | undefined): boolean =>
  c === "management_accounts_upload" || c === "consortium_partnership_agreements";

const GENERAL_DOCUMENTS_MAX_MB = 5;
const DEFAULT_MAX_FILE_SIZE_MB = 10;

export const FileField: FormFieldFactory = {
  addValidation: addValidationWith(({ validation, multiChoice }) => {
    if (multiChoice) {
      const validator = yup.array();
      return validation?.required === true ? validator.min(1) : validator;
    } else {
      return yup.object();
    }
  }),

  renderInput: ({ additionalProps, collection, multiChoice, model }, sharedProps) => {
    const isGeneralDocuments = isGeneralDocumentCollection(collection);
    const maxFileSize =
      additionalProps?.max ?? (isGeneralDocuments ? GENERAL_DOCUMENTS_MAX_MB : DEFAULT_MAX_FILE_SIZE_MB);
    const accept = additionalProps?.accept ?? (isGeneralDocuments ? [FileType.GeneralDocuments] : undefined);

    return (
      <RHFFileInput
        {...sharedProps}
        model={model!}
        isPhotosAndVideo={["photos", "videos"].includes(collection ?? "")}
        allowMultiple={multiChoice}
        collection={collection ?? ""}
        accept={accept}
        maxFileSize={maxFileSize}
        showPrivateCheckbox={additionalProps?.with_private_checkbox}
      />
    );
  },

  getAnswer: ({ name }, formValues) => formValues[name],

  appendAnswers: (field, csv, values, fieldsProvider) => {
    const value = (getAnswer(field, values, fieldsProvider) as UploadedFile[]).filter(isNotNull);
    if (value.length > 0) {
      csv.pushRow([field.label, "FileName", "File Url"]);

      value.forEach(v => {
        csv.pushRow(["", v.fileName ?? "", v.url]);
      });
    }
  },

  formBuilderAdditionalOptions: ({ getSource }) => (
    <BooleanInput
      source={getSource("additionalProps.with_private_checkbox")}
      label="Private or public checkbox"
      helperText="Enable this option to allow project developers to set this file as either private or public."
      defaultValue={false}
    />
  ),

  formBuilderDefaults: ({ collection, multiChoice, formModelType }) => ({
    collection,
    multiChoice: multiChoice ?? undefined,
    model: formModelType
  })
};
