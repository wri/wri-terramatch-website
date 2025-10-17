import { isUndefined, omit, omitBy } from "lodash";
import { CreateResult, DataProvider, GetManyResult, GetOneResult, Identifier, UpdateResult } from "react-admin";

import {
  normalizeFormCreatePayload,
  normalizeFormObject
} from "@/admin/apiProvider/dataNormalizers/formDataNormalizer";
import { handleUploads, upload } from "@/admin/apiProvider/utils/upload";
import { appendAdditionalFormQuestionFields } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { loadLinkedFields } from "@/connections/util/Form";
import {
  DeleteV2AdminFormsUUIDError,
  fetchDeleteV2AdminFormsUUID,
  fetchGetV2AdminForms,
  fetchGetV2FormsUUID,
  fetchPatchV2AdminFormsUUID,
  fetchPostV2AdminForms,
  GetV2AdminFormsError
} from "@/generated/apiComponents";
import { FormRead, FormSectionRead } from "@/generated/apiSchemas";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

export interface FormDataProvider extends Partial<DataProvider> {}

export type NormalizedFormObject = Omit<FormRead, "id"> & { id: Identifier };

const handleOptionFilesUpload = async (response: NormalizedFormObject, payload: any) => {
  const sections = response.form_sections || [];
  const uploadPromises = [];

  for (let sectionIndex = 0; sectionIndex < sections?.length; sectionIndex++) {
    const section: FormSectionRead = response.form_sections?.[sectionIndex] || {};
    const payloadSection = payload.form_sections?.[sectionIndex] || {};
    const questions = section.form_questions || [];

    for (let questionIndex = 0; questionIndex < questions?.length; questionIndex++) {
      const question = questions[questionIndex] || {};
      const payloadQuestion = payloadSection.form_questions?.[questionIndex] || {};
      //@ts-ignore
      const options = question.form_question_options || [];

      for (let optionIndex = 0; optionIndex < options?.length; optionIndex++) {
        const option = options[optionIndex] || {};
        const payloadOption = payloadQuestion.form_question_options?.[optionIndex] || {};

        if (payloadOption.image?.rawFile) {
          uploadPromises.push(
            upload(payloadOption.image.rawFile, {
              collection: "image",
              entity: "formQuestionOptions",
              uuid: option.id
            })
          );
        }
      }
    }
  }

  return Promise.all(uploadPromises);
};

export const formDataProvider: FormDataProvider = {
  async create(_, params) {
    try {
      const uploadKeys = ["banner"];
      const body = omit(params.data, uploadKeys);

      const { data: linkedFieldsData } = await loadLinkedFields({});

      const response = await fetchPostV2AdminForms({
        // @ts-expect-error the v2 post endpoint is not correctly defined.
        body: normalizeFormCreatePayload(body, appendAdditionalFormQuestionFields(linkedFieldsData))
      });

      // @ts-expect-error
      await handleOptionFilesUpload(normalizeFormObject(response.data), params.data);
      // @ts-expect-error
      const uuid = response.data.uuid;

      await handleUploads(params, uploadKeys, { entity: "forms", uuid });

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

      const { data: linkedFieldsData } = await loadLinkedFields({});

      const response = await fetchPatchV2AdminFormsUUID({
        // @ts-expect-error the v2 form update endpoint is not correctly defined.
        pathParams: { uuid: params.id },
        body: normalizeFormCreatePayload(body, appendAdditionalFormQuestionFields(linkedFieldsData ?? []))
      });

      //@ts-expect-error
      await handleOptionFilesUpload(normalizeFormObject(response.data), params.data);

      await handleUploads(params, uploadKeys, { entity: "forms", uuid: String(params.id) });

      //@ts-ignore
      return { data: normalizeFormObject(response.data) } as UpdateResult;
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsError);
    }
  },

  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminForms({
        queryParams: raListParamsToQueryParams(params, [], [], [], { light: true })
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
      //can be optimized by having a getMany endpoint from backend
      const response = await Promise.all(
        params.ids.map(id =>
          fetchGetV2FormsUUID({
            pathParams: { uuid: id as string }
          })
        )
      );

      return {
        data: response?.map(item =>
          //@ts-ignore
          normalizeFormObject(item.data)
        )
      } as GetManyResult;
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
