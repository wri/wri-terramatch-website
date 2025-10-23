import { cloneDeep } from "lodash";

import { isDtoOption } from "@/components/extensive/WizardForm/utils";
import { LocalFieldWithChildren, LocalStep } from "@/context/wizardForm.provider";
import {
  FormFullDto,
  FormQuestionOptionDto,
  StoreFormAttributes,
  StoreFormQuestionAttributes,
  StoreFormQuestionOptionAttributes
} from "@/generated/v3/entityService/entityServiceSchemas";
import { Option } from "@/types/common";
import Log from "@/utils/log";

export type FormBuilderData = Omit<FormFullDto, "sections"> & {
  id: string;
  steps: LocalStep[];
};

export const formDtoToBuilder = ({ sections, ...form }: FormFullDto): FormBuilderData => ({
  ...form,
  id: form.uuid,
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
  sections: steps.map(({ id, fields, ...section }) => ({
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
  }))
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
  options: options?.map(optionToAttributes),
  children: children?.map(fieldToAttributes)
});

const optionToAttributes = (option: FormQuestionOptionDto | Option): StoreFormQuestionOptionAttributes =>
  isDtoOption(option)
    ? option
    : {
        label: option.title,
        slug: String(option.value),
        imageUrl: option.meta.image_url
      };
