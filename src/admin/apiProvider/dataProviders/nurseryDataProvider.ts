import { DataProvider } from "react-admin";

import {
  DeleteV2AdminNurseriesUUIDError,
  fetchDeleteV2AdminNurseriesUUID,
  fetchGetV2AdminNurseries,
  fetchGetV2AdminNurseriesMulti,
  fetchGetV2ENTITYUUID,
  GetV2AdminNurseriesError,
  GetV2AdminNurseriesMultiError,
  GetV2ENTITYUUIDError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

const nurserySortableList = ["name", "project_name", "organisation_name", "start_date", "status"];

// @ts-ignore
export const nurseryDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminNurseries({
        queryParams: raListParamsToQueryParams(params, nurserySortableList)
      });
      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminNurseriesError);
    }
  },

  // @ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2ENTITYUUID({
        pathParams: {
          entity: "nurseries",
          uuid: params.id
        }
      });

      // @ts-ignore
      return { data: { ...response.data, id: response.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2ENTITYUUIDError);
    }
  },

  // @ts-ignore
  async getMany(_, params) {
    try {
      const response = await fetchGetV2AdminNurseriesMulti({
        queryParams: {
          ids: params.ids.join(",")
        }
      });

      return {
        // @ts-ignore
        data: response.data?.map(item => ({
          ...item,
          id: item.uuid
        }))
      };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminNurseriesMultiError);
    }
  },

  //@ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminNurseriesUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminNurseriesUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminNurseriesUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminNurseriesUUIDError);
    }
  }
};
