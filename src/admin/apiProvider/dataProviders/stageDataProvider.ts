/**
 * Stage Data Provider
 * An Stage sits inbetween Funding Programmes and Submissions (Applications)
 */

import { format } from "date-fns";
import { DataProvider, Identifier } from "react-admin";

import {
  fetchGetV2FundingProgrammeStage,
  fetchGetV2FundingProgrammeStageUUID,
  fetchPatchV2AdminFundingProgrammeStageUUID,
  fetchPostV2AdminFundingProgrammeStage,
  GetV2FundingProgrammeStageError,
  GetV2FundingProgrammeStageUUIDError,
  PatchV2AdminFundingProgrammeStageUUIDError,
  PostV2AdminFundingProgrammeStageError
} from "@/generated/apiComponents";
import { StageRead } from "@/generated/apiSchemas";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

export const stageSortableList: string[] = [];
export interface StageDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

const normalizeStageObject = (item: StageRead) => ({
  ...item,
  id: item.uuid as Identifier
});

const normalizeStagePayload = (object: StageRead) => ({
  ...object,
  //@ts-expect-error
  form_id: object.form.uuid,
  deadline_at: object.deadline_at ? format(new Date(Date.parse(object.deadline_at)), "Y-MM-dd HH:mm:ss") : undefined
});

export const stageDataProvider: StageDataProvider = {
  //@ts-ignore
  async getList(_, params) {
    try {
      const response = await fetchGetV2FundingProgrammeStage({
        queryParams: raListParamsToQueryParams(params, stageSortableList)
      });

      // @ts-ignore issue with generated client
      const result = apiListResponseToRAListResult(response);

      return {
        ...result,
        data: result.data?.map((item: StageRead) => normalizeStageObject(item))
      };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2FundingProgrammeStageError);
    }
  },

  // @ts-ignore
  async getMany(_, params) {
    try {
      const data: StageRead[] = [];

      for (const id of params.ids) {
        const resp = await fetchGetV2FundingProgrammeStageUUID({
          // @ts-ignore
          pathParams: { uuid: id as string }
        });

        // @ts-ignore issue with ids
        data.push({ ...resp.data, id: resp.data.uuid });
      }
      return { data };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2FundingProgrammeStageUUIDError);
    }
  },

  async getManyReference(_, params) {
    const res = await fetchGetV2FundingProgrammeStage({
      queryParams: {
        ...raListParamsToQueryParams(params, stageSortableList),
        ["filter[funding_programme_id]"]: params.id
      }
    });

    // @ts-ignore issue with generated client
    return apiListResponseToRAListResult(res);
  },

  async getOne(_, params) {
    try {
      const response = await fetchGetV2FundingProgrammeStageUUID({
        pathParams: { uuid: params.id as string }
      });
      //@ts-ignore
      return { data: { ...response.data, id: response.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2FundingProgrammeStageUUIDError);
    }
  },

  async update(_, params) {
    const uuid = params.id as string;

    try {
      const resp = await fetchPatchV2AdminFundingProgrammeStageUUID({
        // @ts-expect-error
        pathParams: { uuid },
        body: normalizeStagePayload(params.data)
      });

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PatchV2AdminFundingProgrammeStageUUIDError);
    }
  },

  async create(_, params) {
    try {
      const resp = await fetchPostV2AdminFundingProgrammeStage({ body: normalizeStagePayload(params.data) });

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PostV2AdminFundingProgrammeStageError);
    }
  }
};
