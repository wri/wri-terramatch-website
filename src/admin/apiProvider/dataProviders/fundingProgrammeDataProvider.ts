import lo, { sortBy } from "lodash";
import { DataProvider, GetManyResult, GetOneResult, Identifier, RaRecord } from "react-admin";

import { stageDataProvider } from "@/admin/apiProvider/dataProviders/stageDataProvider";
import {
  DeleteV2AdminFundingProgrammeUUIDError,
  fetchDeleteV2AdminFundingProgrammeUUID,
  fetchGetV2AdminFundingProgramme,
  fetchGetV2AdminFundingProgrammeUUID,
  fetchPostV2AdminFundingProgramme,
  fetchPutV2AdminFundingProgrammeUUID,
  GetV2AdminFundingProgrammeError,
  GetV2AdminFundingProgrammeUUIDError,
  PostV2AdminFundingProgrammeError,
  PutV2AdminFundingProgrammeUUIDError
} from "@/generated/apiComponents";
import { FundingProgramme } from "@/generated/apiSchemas";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";
import { handleUploads } from "../utils/upload";

export interface FundingDataProvider extends DataProvider {}

interface Record extends Omit<FundingProgramme, "id">, RaRecord {
  id: Identifier;
}

/**
 * add replace `id` with `uuid`, sort stages based on order attribute
 * @param object api response
 * @returns normalized version of api response
 */
const normalizeFundingProgrammeObject = (object: FundingProgramme): Record => ({
  ...object,
  id: object.uuid as Identifier,
  //@ts-ignore
  stages: sortBy(object.stages?.data, "order"),
  // @ts-ignore
  organisationIds: object.data?.organisations?.map(org => org.uuid) || []
});

export const fundingProgrammeDataProvider: FundingDataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminFundingProgramme({
        queryParams: raListParamsToQueryParams(params)
      });
      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFundingProgrammeError);
    }
  },

  async getOne(_, params) {
    try {
      const response = await fetchGetV2AdminFundingProgrammeUUID({
        pathParams: { uuid: params.id }
      });

      return {
        //@ts-ignore
        data: normalizeFundingProgrammeObject(response.data)
      } as GetOneResult;
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFundingProgrammeUUIDError);
    }
  },

  async getMany(_, params) {
    try {
      const data: FundingProgramme[] = [];

      for (const id of params.ids) {
        const resp = await fetchGetV2AdminFundingProgrammeUUID({
          pathParams: { uuid: id as string }
        });

        // @ts-ignore issue with ids
        data.push({ ...resp.data, id: resp.data.uuid });
      }
      return { data } as GetManyResult;
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFundingProgrammeUUIDError);
    }
  },

  async update(_, params) {
    try {
      const uuid = params.id as string;
      const uploadKeys = ["cover"];
      const { stages, ...body } = lo.omit(params.data, uploadKeys) as any;

      await handleUploads(params, uploadKeys, {
        uuid,
        model: "funding-programme"
      });

      // TODO: For each stage - update

      const resp = await fetchPutV2AdminFundingProgrammeUUID({ pathParams: { uuid }, body });

      for (let index = 0; index < stages.length; index++) {
        const stage = stages[index];

        if (stage.uuid) {
          await stageDataProvider.update("", {
            id: stage.uuid,
            previousData: {},
            data: {
              ...stage,
              //@ts-ignore
              funding_programme_id: resp.data.uuid,
              order: index + 1
            }
          });
        } else {
          await stageDataProvider.create("", {
            data: {
              ...stage,
              //@ts-ignore
              funding_programme_id: resp.data.uuid,
              order: index + 1
            }
          });
        }
      }

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PutV2AdminFundingProgrammeUUIDError);
    }
  },

  async create(_, params) {
    try {
      const uploadKeys = ["cover"];
      const { stages, ...body } = lo.omit(params.data, uploadKeys) as any;

      const resp = await fetchPostV2AdminFundingProgramme({ body });

      for (let index = 0; index < stages.length; index++) {
        const stage = stages[index];

        await stageDataProvider.create("", {
          data: {
            ...stage,
            //@ts-ignore
            funding_programme_id: resp.data.uuid,
            order: index + 1
          }
        });
      }

      await handleUploads(params, uploadKeys, {
        //@ts-ignore
        uuid: resp.data.uuid,
        model: "funding-programme"
      });

      // TODO: For each stage - create

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PostV2AdminFundingProgrammeError);
    }
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminFundingProgrammeUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminFundingProgrammeUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminFundingProgrammeUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminFundingProgrammeUUIDError);
    }
  }
};
