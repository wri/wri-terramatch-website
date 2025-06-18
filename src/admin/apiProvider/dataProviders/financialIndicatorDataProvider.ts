import { DataProvider } from "react-admin";

import { deleteSiteReport, loadFullSiteReport } from "@/connections/Entity";
import { fetchGetV2FinancialIndicators, GetV2FinancialIndicatorsError } from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

export const financialIndicatorSortableList: string[] = ["created_at"];
// @ts-ignore
export const financialIndicatorDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2FinancialIndicators({
        queryParams: raListParamsToQueryParams(params, financialIndicatorSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2FinancialIndicatorsError);
    }
  },
  // @ts-ignore
  async getOne(_, params) {
    const { entity: siteReport, fetchFailure } = await loadFullSiteReport({ uuid: params.id });
    if (fetchFailure != null) {
      throw v3ErrorForRA("Site report get fetch failed", fetchFailure);
    }

    return { data: { ...siteReport, id: siteReport!.uuid } };
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await deleteSiteReport(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Site report delete failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteSiteReport(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Site report deleteMany failed", err);
    }
  }
};
