import { DataProvider, HttpError } from "react-admin";

import { loadNurseryIndex } from "@/connections/Entity";
import {
  DeleteV2AdminNurseriesUUIDError,
  fetchDeleteV2AdminNurseriesUUID,
  fetchGetV2AdminNurseriesMulti,
  fetchGetV2ENTITYUUID,
  GetV2AdminNurseriesMultiError,
  GetV2ENTITYUUIDError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const nurseryDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on Nurseries DTOs
  async getList(_, params) {
    const connection = await loadNurseryIndex(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw new HttpError(connection.fetchFailure.message, connection.fetchFailure.statusCode);
    }
    return entitiesListResult(connection);
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
