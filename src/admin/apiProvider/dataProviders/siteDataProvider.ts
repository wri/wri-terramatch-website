import { DataProvider, HttpError } from "react-admin";

import { loadFullSite, loadSiteIndex } from "@/connections/Entity";
import {
  DeleteV2AdminSitesUUIDError,
  fetchDeleteV2AdminSitesUUID,
  fetchGetV2AdminSitesMulti,
  GetV2AdminSitesMultiError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const siteDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on Site DTOs
  async getList(_, params) {
    const connection = await loadSiteIndex(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw new HttpError(connection.fetchFailure.message, connection.fetchFailure.statusCode);
    }

    return entitiesListResult(connection);
  },

  // @ts-ignore
  async getOne(_, params) {
    const { entity: site, fetchFailure } = await loadFullSite({ uuid: params.id });
    if (fetchFailure != null) {
      throw new HttpError(fetchFailure.message, fetchFailure.statusCode);
    }

    return { data: { ...site, id: site!.uuid } };
  },

  // @ts-ignore
  async getMany(_, params) {
    try {
      const response = await fetchGetV2AdminSitesMulti({
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
      throw getFormattedErrorForRA(err as GetV2AdminSitesMultiError);
    }
  },

  //@ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminSitesUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminSitesUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminSitesUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminSitesUUIDError);
    }
  }
};
