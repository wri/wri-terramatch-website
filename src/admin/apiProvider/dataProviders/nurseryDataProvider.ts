import { DataProvider } from "react-admin";

import { deleteNursery, loadFullNursery, loadNurseryIndex } from "@/connections/Entity";
import { fetchGetV2AdminNurseriesMulti, GetV2AdminNurseriesMultiError } from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { connectionDataProvider } from "../utils/listing";

export const nurseryDataProvider: Partial<DataProvider> = {
  ...connectionDataProvider("Nursery", loadNurseryIndex, loadFullNursery, deleteNursery),

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
  }
};
