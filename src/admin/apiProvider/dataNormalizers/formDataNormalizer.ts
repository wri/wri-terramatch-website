import { format } from "date-fns";
import { isBoolean } from "lodash";

import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { AdditionalInputTypes } from "@/admin/types/common";

function setOrderFromIndex<T extends any>(array: T[]): (T & { order: number })[] {
  return array.map((element: any, index) => ({ ...element, order: index }));
}

// Payload normalizer
/**
 * updates section and questions order based on it's position in the list.
 * @param payload formCreateObject
 * @returns normalized version of formCreateObject
 */
export const normalizeFormCreatePayload = (payload: any, linkedFieldData: FormQuestionField[]) => ({
  ...payload,
  deadline_at: payload.deadline_at
    ? (() => {
        try {
          return format(new Date(Date.parse(payload.deadline_at)), "Y-MM-dd HH:mm:ss");
        } catch (e) {
          return null;
        }
      })()
    : null,
  form_sections: setOrderFromIndex(payload.form_sections ?? [])?.map((section: any) => ({
    ...section,
    form_questions: setOrderFromIndex(section.form_questions ?? [])?.map((question: any) =>
      normalizeQuestionCreatePayload(question, linkedFieldData)
    )
  }))
});

export const normalizeQuestionCreatePayload = (payload: any, linkedFieldData: FormQuestionField[]) => {
  const { form_question_options, table_headers, child_form_questions, ...restOfPayload } = payload;
  const field = linkedFieldData.find(field => field.id === payload.linked_field_key);
  const input_type = field?.inputType;
  const output = {
    ...restOfPayload,
    input_type: field?.inputType
  };

  //@ts-ignore
  if (field?.collection) {
    //@ts-ignore
    output.collection = field?.collection;
  }

  if (isBoolean(field?.multiChoice)) {
    output.multichoice = field?.multiChoice;
  }

  //@ts-ignore
  if (field?.option_list_key) {
    //@ts-ignore
    output.options_list = field.option_list_key;
  }

  if (form_question_options) {
    output.form_question_options = setOrderFromIndex(
      //@ts-ignore
      form_question_options?.map(normalizeQuestionOptionsPayload)
    );
  }

  if (!!table_headers && input_type === AdditionalInputTypes.TableInput) {
    output.table_headers = setOrderFromIndex(table_headers);
  }

  if (child_form_questions) {
    output.child_form_questions = setOrderFromIndex(child_form_questions)?.map((childQuestion: any) =>
      normalizeQuestionCreatePayload(childQuestion, linkedFieldData)
    );
  }

  return output;
};

const normalizeQuestionOptionsPayload = (payload: any) => {
  const output: any = {
    label: payload.label
  };

  if (payload.slug) {
    output.slug = payload.slug;
  }

  if (payload.uuid) {
    output.uuid = payload.uuid;
  }

  if (payload.id) {
    output.id = payload.id;
  }

  if (payload.image?.url || payload.image_url) {
    output.image_url = payload.image?.url || payload.image_url;
  }

  return output;
};
