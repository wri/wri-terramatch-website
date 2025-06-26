import { DataProvider } from "react-admin";

import { deleteNursery, loadFullNursery, loadNurseryIndex } from "@/connections/Entity";
import { fetchGetV2AdminNurseriesMulti, GetV2AdminNurseriesMultiError } from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const nurseryDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on Nurseries DTOs
  async getList(_, params) {
    const connection = await loadNurseryIndex(raConnectionProps(params));
    if (connection.loadFailure != null) {
      throw v3ErrorForRA("Nursery index fetch failed", connection.loadFailure);
    }
    return entitiesListResult(connection);
  },

  // @ts-ignore
  async getOne(_, params) {
    const { entity: site, fetchFailure } = await loadFullNursery({ uuid: params.id });
    if (fetchFailure != null) {
      throw v3ErrorForRA("Nursery get fetch failed", fetchFailure);
    }

    return { data: { ...site, id: site!.uuid } };
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

  //@ts-expect-error until we can get the whole DataProvider on Nursery DTOs
  async delete(_, params) {
    try {
      await deleteNursery(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Nursery delete failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteNursery(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Nursery deleteMany failed", err);
    }
  }
};
