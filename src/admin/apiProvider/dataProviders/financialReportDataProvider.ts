import { DataProvider } from "react-admin";

import { deleteSiteReport } from "@/connections/Entity";
import {
  fetchGetV2FinancialReports,
  fetchGetV2FinancialReportsUUID,
  GetV2FinancialReportsError
} from "@/generated/apiComponents";
import { V2AdminOrganisationRead } from "@/generated/apiSchemas";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

const normalizeOrganisationObject = (object: V2AdminOrganisationRead) => {
  // @ts-ignore incorrect docs
  const enrolled_funding_programmes = object.data?.project_pitches
    // @ts-ignore incorrect docs
    ?.map(pitch => pitch.funding_programme?.uuid)
    // @ts-ignore
    .filter((value, index, self) => self.indexOf(value) === index);

  //@ts-ignore
  return { data: { ...object.data, id: object.data.uuid, enrolled_funding_programmes } };
};

export const financialReportSortableList: string[] = ["created_at"];
// @ts-ignore
export const financialReportDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2FinancialReports({
        queryParams: raListParamsToQueryParams(params, financialReportSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2FinancialReportsError);
    }
  },
  // @ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2FinancialReportsUUID({
        pathParams: { uuid: params.id }
      });

      return normalizeOrganisationObject(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2FinancialReportsError);
    }
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
