import { isUndefined, omit, omitBy } from "lodash";
import { CreateResult, DataProvider, DeleteParams, GetListParams, GetManyResult, GetOneParams } from "react-admin";

import { normalizeFormCreatePayload } from "@/admin/apiProvider/dataNormalizers/formDataNormalizer";
import { handleUploads, upload } from "@/admin/apiProvider/utils/upload";
import { appendAdditionalFormQuestionFields } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import {
  FormBuilderData,
  formBuilderToAttributes,
  formDtoToBuilder
} from "@/admin/modules/form/components/FormBuilder/types";
import { createForm, deleteForm, loadForm, loadFormIndex, loadLinkedFields } from "@/connections/util/Form";
import { fetchPatchV2AdminFormsUUID, PostV2AdminFormsError } from "@/generated/apiComponents";
import { FormFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Option } from "@/types/common";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";

export interface FormDataProvider extends Partial<DataProvider> {}

const handleOptionFilesUpload = async (form: FormFullDto, payload: FormBuilderData) => {
  const uploadPromises: Promise<unknown>[] = [];

  (form.sections ?? []).forEach((section, sectionIndex) => {
    const payloadSection = payload.steps[sectionIndex] ?? {};
    (section.questions ?? []).forEach((question, questionIndex) => {
      const payloadQuestion = payloadSection.fields?.[questionIndex] ?? {};
      (question.options ?? []).forEach((option, optionIndex) => {
        const payloadOption = (payloadQuestion.options?.[optionIndex] ?? {}) as Option;
        if (payloadOption.meta?.rawFile == null) return;

        uploadPromises.push(
          upload(payloadOption.meta.rawFile, {
            collection: "image",
            entity: "formQuestionOptions",
            uuid: option.id
          })
        );
      });
    });
  });

  return Promise.all(uploadPromises);
};

export const formDataProvider: FormDataProvider = {
  async create(_, params) {
    try {
      const uploadKeys = ["banner"];
      const body = omit(params.data, uploadKeys) as FormBuilderData;
      const form = await createForm(formBuilderToAttributes(body));

      await handleOptionFilesUpload(form, body);
      await handleUploads(params, uploadKeys, { entity: "forms", uuid: form.uuid });

      return { data: { id: form.uuid } } as CreateResult;
    } catch (createFailure) {
      throw v3ErrorForRA("Form creation failed", createFailure);
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
      throw getFormattedErrorForRA(err as PostV2AdminFormsError);
    }
  },

  async getList<RecordType>(_: string, params: GetListParams) {
    const connected = await loadFormIndex(raConnectionProps(params));
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("Form index fetch failed", connected.loadFailure);
    }

    return {
      data: (connected.data?.map(form => ({ ...form, id: form.uuid })) ?? []) as RecordType[],
      total: connected.indexTotal
    };
  },

  async getOne<RecordType>(_: string, { id }: GetOneParams) {
    // Disable translation for admin data provider; forms must be edited in English so that the
    // labels that will be translated from the DB are in English as the source language.
    const connected = await loadForm({ id, translated: false });
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("Form get fetch failed", connected.loadFailure);
    }

    return { data: formDtoToBuilder(connected.data!) } as RecordType;
  },

  async getMany(_, params) {
    const response = await Promise.all(
      params.ids.map(async id => await loadForm({ id: id as string, translated: false }))
    );
    const failed = response.find(({ loadFailure }) => loadFailure != null);
    if (failed != null) {
      throw v3ErrorForRA("Form get fetch failed", failed.loadFailure);
    }

    return {
      data: response.map(({ data }) => formDtoToBuilder(data!))
    } as GetManyResult;
  },

  async delete<RecordType>(_: string, { id }: DeleteParams) {
    try {
      await deleteForm(id as string);
      return { data: { id } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("Form delete fetch failed", err);
    }
  }
};
