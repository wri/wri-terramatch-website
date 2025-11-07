import { cloneDeep } from "lodash";
import isArray from "lodash/isArray";

import { isDtoOption } from "@/components/extensive/WizardForm/utils";
import { LocalFieldWithChildren, LocalStep } from "@/context/wizardForm.provider";
import {
  FormFullDto,
  FormQuestionOptionDto,
  StoreFormAttributes,
  StoreFormQuestionAttributes,
  StoreFormQuestionOptionAttributes,
  StoreFormSectionAttributes
} from "@/generated/v3/entityService/entityServiceSchemas";
import { mediaToUploadedFile, Option, UploadedFile } from "@/types/common";
import Log from "@/utils/log";

export type FormBuilderData = Omit<FormFullDto, "banner" | "sections"> & {
  id: string;
  published: boolean;
  banner?: UploadedFile;
  steps: LocalStep[];
};

export const formDtoToBuilder = ({ sections, ...form }: FormFullDto): FormBuilderData => ({
  ...form,
  id: form.uuid,
  banner: form.banner == null ? undefined : mediaToUploadedFile(form.banner),
  steps: sections.map(({ questions, ...step }) => ({
    ...step,
    fields: questions.map(({ children, ...field }) => ({
      ...cloneDeep(field),
      children: cloneDeep(children ?? undefined)
    }))
  }))
});

export const formBuilderToAttributes = ({ id, steps, ...form }: FormBuilderData): StoreFormAttributes => ({
  ...form,
  sections: steps.map(
    ({ id, fields, ...section }): StoreFormSectionAttributes => ({
      id: id?.startsWith("new-step-") ? undefined : id,
      ...section,
      questions: fields
        .filter(({ inputType }) => {
          if (["tel", "empty"].includes(inputType)) {
            Log.error("Invalid input type for server-driven forms", inputType);
            return false;
          }
          return true;
        })
        .map(fieldToAttributes)
    })
  )
});

const fieldToAttributes = ({
  name,
  children,
  options,
  inputType,
  ...question
}: LocalFieldWithChildren): StoreFormQuestionAttributes => ({
  name: name?.startsWith("new-field-") ? undefined : name,
  ...question,
  inputType: inputType as StoreFormQuestionAttributes["inputType"],
  // Due to how PHP serializes an empty "object", we have > 2k rows in the DB that have an empty
  // JSON array instead of an empty JSON object for additional props. That causes a validation
  // failure in v3, so move it to an object as we update the form.
  additionalProps:
    isArray(question.additionalProps) && question.additionalProps.length === 0 ? {} : question.additionalProps,
  options: options?.map(optionToAttributes),
  children: children?.map(fieldToAttributes)
});

const optionToAttributes = (option: FormQuestionOptionDto | Option): StoreFormQuestionOptionAttributes =>
  isDtoOption(option)
    ? option
    : {
        label: option.title,
        slug: String(option.value),
        imageUrl: option.image?.url
      };
