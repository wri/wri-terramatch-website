import { format } from "date-fns";
import { sortBy } from "lodash";
import { Identifier } from "react-admin";

import { NormalizedFormObject } from "@/admin/apiProvider/dataProviders/formDataProvider";
import { setOrderFromIndex } from "@/admin/apiProvider/utils/normaliser";
import { AdditionalInputTypes } from "@/admin/types/common";
import { FormQuestionRead, FormRead, V2GenericList } from "@/generated/apiSchemas";

//Response normalizers
/**
 * add replace `id` with `uuid`, sort sections and question based on order attribute
 * @param form api response
 * @returns normalized version of api response
 */
export const normalizeFormObject = (form: FormRead): NormalizedFormObject => ({
  ...form,
  id: form.uuid as Identifier,
  deadline_at: form.deadline_at ? new Date(form.deadline_at!).toLocaleString("en-US", { timeZone: "EST" }) : undefined,

  form_sections: sortBy(
    form.form_sections?.map(section => ({
      ...section,
      form_questions: sortBy(section.form_questions?.map(normalizeFormQuestion), ["order"])
    })),
    ["order"]
  )
});

const normalizeFormQuestion = (question: any) => {
  const {
    children,
    options,
    with_numbers,
    with_intensity,
    with_extent,
    with_private_checkbox,
    capture_count,
    ...output
  }: any = question;

  if (children) {
    output.child_form_questions = sortBy(children.map(normalizeFormQuestion), ["order"]);
  }

  if (options) {
    output.form_question_options = sortBy(options, ["order"]);
  }

  output.additional_props = { with_numbers, with_intensity, with_extent, with_private_checkbox, capture_count };

  return output;
};

// Payload normalizer
/**
 * updates section and questions order based on it's position in the list.
 * @param payload formCreateObject
 * @returns normalized version of formCreateObject
 */
export const normalizeFormCreatePayload = (
  payload: FormRead,
  linkedFieldData: (V2GenericList & { input_type: string; multichoice: boolean | null })[]
): any => ({
  ...payload,
  deadline_at: payload.deadline_at ? format(new Date(Date.parse(payload.deadline_at)), "dd/MM/yyyy HH:mm:ss") : null,
  form_sections: setOrderFromIndex(payload.form_sections || [])?.map(section => ({
    ...section,
    form_questions: setOrderFromIndex(section.form_questions || [])?.map((question: any) =>
      normalizeQuestionCreatePayload(question, linkedFieldData)
    )
  }))
});

export const normalizeQuestionCreatePayload = (
  payload: FormQuestionRead & any,
  linkedFieldData: (V2GenericList & { input_type: string; multichoice: boolean | null })[]
) => {
  const { form_question_options, table_headers, child_form_questions, ...restOfPayload } = payload;
  const input_type = linkedFieldData.find(field => field.uuid === payload.linked_field_key)?.input_type;
  const field = linkedFieldData.find(field => field.uuid === payload.linked_field_key);
  const output = {
    ...restOfPayload,
    input_type: field?.input_type
  };

  //@ts-ignore
  if (field?.collection) {
    //@ts-ignore
    output.collection = field?.collection;
  }

  if (typeof field?.multichoice === "boolean") {
    output.multichoice = field?.multichoice;
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
