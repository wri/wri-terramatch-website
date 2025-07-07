import { DataProvider } from "react-admin";

import {
  DeleteV2FinancialReportsUUIDError,
  fetchDeleteV2FinancialReportsUUID,
  fetchGetV2FinancialReports,
  fetchGetV2FinancialReportsUUID,
  GetV2FinancialReportsError
} from "@/generated/apiComponents";
import { V2AdminOrganisationRead } from "@/generated/apiSchemas";

import { getFormattedErrorForRA } from "../utils/error";
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
      await fetchDeleteV2FinancialReportsUUID({
        pathParams: { uuid: params.id as string }
      });

      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2FinancialReportsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2FinancialReportsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2FinancialReportsUUIDError);
    }
  }
};
