import { DataProvider } from "react-admin";

import {
  fetchGetV2AdminReportingFrameworks,
  fetchPostV2AdminReportingFrameworks,
  fetchPutV2AdminReportingFrameworksUUID,
  GetV2AdminReportingFrameworksError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

// @ts-ignore
export const reportingFrameworkDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminReportingFrameworks({
        queryParams: raListParamsToQueryParams(params, [])
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminReportingFrameworksError);
    }
  },
  //@ts-ignore
  async getOne(_, params) {
    try {
      //To be replaced with fetchGetV2AdminReportingFrameworksUUID When implemented
      const list = await fetchGetV2AdminReportingFrameworks({});
      const response = { data: list.data?.find(item => item.uuid === params.id) };

      //@ts-ignore
      return { data: { ...response.data, id: response.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminReportingFrameworksError);
    }
  },
  //@ts-ignore
  async create(__, params) {
    try {
      const response = await fetchPostV2AdminReportingFrameworks({
        body: params.data
      });

      // @ts-expect-error
      return { data: { ...response.data, id: response.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminReportingFrameworksError);
    }
  },
  //@ts-ignore
  async update(__, params) {
    try {
      const response = await fetchPutV2AdminReportingFrameworksUUID({
        body: params.data,
        pathParams: { uuid: params.id as string }
      });

      // @ts-expect-error
      return { data: { ...response.data, id: response.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminReportingFrameworksError);
    }
  }
};
