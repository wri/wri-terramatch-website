import { format } from "date-fns";
import { isUndefined, omit, omitBy, sortBy } from "lodash";
import { CreateResult, DataProvider, GetManyResult, GetOneResult, Identifier, UpdateResult } from "react-admin";

import { setOrderFromIndex } from "@/admin/apiProvider/utils/normaliser";
import { handleUploads } from "@/admin/apiProvider/utils/upload";
import { appendAdditionalFormQuestionFields } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { AdditionalInputTypes } from "@/admin/types/common";
import {
  DeleteV2AdminFormsUUIDError,
  fetchDeleteV2AdminFormsUUID,
  fetchGetV2AdminForms,
  fetchGetV2FormsLinkedFieldListing,
  fetchGetV2FormsUUID,
  fetchPatchV2AdminFormsUUID,
  fetchPostV2AdminForms,
  GetV2AdminFormsError
} from "@/generated/apiComponents";
import { FormQuestionOptionRead, FormQuestionRead, FormRead, V2GenericList } from "@/generated/apiSchemas";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

export interface FormDataProvider extends Partial<DataProvider> {}

/**
 * add replace `id` with `uuid`, sort sections and question based on order attribute
 * @param form api response
 * @returns normalized version of api response
 */
const normalizeFormObject = (form: FormRead): Omit<FormRead, "id"> & { id: Identifier } => ({
  ...form,
  id: form.uuid as Identifier,
  deadline_at: new Date(form.deadline_at!).toLocaleString("en-US", { timeZone: "EST" }),

  form_sections: sortBy(
    form.form_sections?.map(section => ({
      ...section,
      form_questions: sortBy(
        section.form_questions?.map(question => {
          const { children, options, with_numbers, ...output }: any = question;

          if (children) {
            output.child_form_questions = sortBy(children, ["order"]);
          }

          if (options) {
            output.form_question_options = sortBy(options, ["order"]);
          }

          if (typeof with_numbers === "boolean") {
            output.additional_props = { with_numbers };
          }

          return output;
        }),
        ["order"]
      )
    })),
    ["order"]
  )
});

const normalizeQuestionOptionsPayload = (payload: FormQuestionOptionRead & { slug: string }) => {
  const output: Partial<FormQuestionOptionRead & { slug: string }> = { label: payload.label, slug: payload.slug };
  if (payload.uuid) {
    output.uuid = payload.uuid;
  }

  if (payload.id) {
    output.id = payload.id;
  }

  return output;
};

export const normalizeQuestionCreatePayload = (
  payload: FormQuestionRead & any,
  linkedFieldData: (V2GenericList & { input_type: string; multichoice: boolean | null })[]
) => {
  const field = linkedFieldData.find(field => field.uuid === payload.linked_field_key);
  const output = {
    ...payload,
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

  if (payload.form_question_options) {
    output.form_question_options = setOrderFromIndex(
      //@ts-ignore
      payload.form_question_options?.map(normalizeQuestionOptionsPayload)
    );
  }

  return output;
};

/**
 * updates section and questions order based on it's position in the list.
 * @param payload formCreateObject
 * @returns normalized version of formCreateObject
 */
const normalizeFormCreatePayload = (
  payload: FormRead,
  linkedFieldData: (V2GenericList & { input_type: string; multichoice: boolean | null })[]
): any => ({
  ...payload,
  deadline_at: payload.deadline_at ? format(new Date(Date.parse(payload.deadline_at)), "Y-MM-dd HH:mm:ss") : undefined,
  form_sections: setOrderFromIndex(payload.form_sections || [])?.map((section, index) => ({
    ...section,
    form_questions: setOrderFromIndex(section.form_questions || [])?.map((question: any) => {
      const input_type = linkedFieldData.find(field => field.uuid === question.linked_field_key)?.input_type;
      const output: any = normalizeQuestionCreatePayload(question, linkedFieldData);

      if (question?.child_form_questions) {
        output.child_form_questions = setOrderFromIndex(question?.child_form_questions)?.map((childQuestion: any) =>
          normalizeQuestionCreatePayload(childQuestion, linkedFieldData)
        );
      }

      if (question.table_headers && input_type === AdditionalInputTypes.TableInput) {
        output.table_headers = setOrderFromIndex(question.table_headers);
      }
      return output;
    })
  }))
});

export const formDataProvider: FormDataProvider = {
  async create(_, params) {
    try {
      const uploadKeys = ["banner"];
      const body = omit(params.data, uploadKeys);
      const linkedFieldsData = await fetchGetV2FormsLinkedFieldListing({});

      const response = await fetchPostV2AdminForms({
        //@ts-expect-error
        body: normalizeFormCreatePayload(body, appendAdditionalFormQuestionFields(linkedFieldsData.data))
      });

      await handleUploads(params, uploadKeys, {
        model: "form",
        //@ts-expect-error
        uuid: response.data.uuid
      });

      //@ts-expect-error
      return { data: normalizeFormObject(response.data) } as CreateResult;
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsError);
    }
  },

  async update(_, params) {
    try {
      const uploadKeys = ["banner"];
      const body = omitBy(omit(params.data, uploadKeys), isUndefined);

      const linkedFieldsData = await fetchGetV2FormsLinkedFieldListing({});

      const response = await fetchPatchV2AdminFormsUUID({
        //@ts-expect-error
        pathParams: { uuid: params.id },
        //@ts-expect-error
        body: normalizeFormCreatePayload(body, appendAdditionalFormQuestionFields(linkedFieldsData.data))
      });

      await handleUploads(params, uploadKeys, {
        model: "form",
        //@ts-ignore
        uuid: params.id
      });

      //@ts-ignore
      return { data: normalizeFormObject(response.data) } as UpdateResult;
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsError);
    }
  },

  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminForms({
        queryParams: raListParamsToQueryParams(params, [])
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsError);
    }
  },

  async getOne(_, params) {
    try {
      const response = await fetchGetV2FormsUUID({
        pathParams: { uuid: params.id }
      });
      //@ts-ignore
      return { data: normalizeFormObject(response.data) } as GetOneResult;
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsError);
    }
  },

  async getMany(_, params) {
    try {
      const response = await fetchGetV2AdminForms({
        queryParams: { ids: params.ids.join(",") }
      });

      return { data: response.data?.map(item => normalizeFormObject(item)) } as GetManyResult;
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsError);
    }
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminFormsUUID({
        // @ts-ignore issue with docs
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminFormsUUIDError);
    }
  }
};
