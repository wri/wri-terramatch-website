import { DataProvider } from "react-admin";

import { deleteSite, loadFullSite, loadSiteIndex } from "@/connections/Entity";
import { fetchGetV2AdminSitesMulti, GetV2AdminSitesMultiError } from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { connectionDataProvider } from "../utils/listing";

export const siteDataProvider: Partial<DataProvider> = {
  ...connectionDataProvider("Site", loadSiteIndex, loadFullSite, deleteSite),

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
  }
};
