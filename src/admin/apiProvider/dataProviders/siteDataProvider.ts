import { DataProvider } from "react-admin";

import { deleteSite, loadFullSite, loadSiteIndex } from "@/connections/Entity";
import { fetchGetV2AdminSitesMulti, GetV2AdminSitesMultiError } from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const siteDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on Site DTOs
  async getList(_, params) {
    const connection = await loadSiteIndex(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Site index fetch failed", connection.fetchFailure);
    }

    return entitiesListResult(connection);
  },

  // @ts-ignore
  async getOne(_, params) {
    const { entity: site, fetchFailure } = await loadFullSite({ uuid: params.id });
    if (fetchFailure != null) {
      throw v3ErrorForRA("Site get fetch failed", fetchFailure);
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

  //@ts-expect-error until we can get the whole DataProvider on Site DTOs
  async delete(_, params) {
    try {
      await deleteSite(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Site delete failed", err);
    }
  },

  //@ts-expect-error until we can get the whole DataProvider on Site DTOs
  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteSite(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Site deleteMany failed", err);
    }
  }
};
