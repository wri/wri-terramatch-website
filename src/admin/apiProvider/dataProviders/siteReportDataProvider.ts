import { DataProvider } from "react-admin";

import {
  DeleteV2AdminSiteReportsUUIDError,
  fetchDeleteV2AdminSiteReportsUUID,
  fetchGetV2AdminSiteReports,
  fetchGetV2ENTITYUUID,
  GetV2AdminSiteReportsError,
  GetV2ENTITYUUIDError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

const siteReportSortableList = ["title", "project_name", "site_name", "organisation_name", "due_at", "submitted_at"];

// @ts-ignore
export const siteReportDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminSiteReports({
        queryParams: raListParamsToQueryParams(params, siteReportSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminSiteReportsError);
    }
  },
  // @ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2ENTITYUUID({
        pathParams: {
          entity: "site-reports",
          uuid: params.id as string
        }
      });

      // @ts-ignore
      return { data: { ...response.data, id: response.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2ENTITYUUIDError);
    }
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminSiteReportsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminSiteReportsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminSiteReportsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminSiteReportsUUIDError);
    }
  }
};
