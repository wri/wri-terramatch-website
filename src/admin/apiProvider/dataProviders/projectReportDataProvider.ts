import { DataProvider } from "react-admin";

import {
  DeleteV2AdminProjectReportsUUIDError,
  fetchDeleteV2AdminProjectReportsUUID,
  fetchGetV2AdminProjectReports,
  fetchGetV2ENTITYUUID,
  GetV2AdminProjectReportsError,
  GetV2ENTITYUUIDError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

const projectReportSortableList = ["title", "project_name", "organisation_name", "due_at", "submitted_at"];

// @ts-ignore
export const projectReportDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminProjectReports({
        queryParams: raListParamsToQueryParams(params, projectReportSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminProjectReportsError);
    }
  },

  // @ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2ENTITYUUID({
        pathParams: {
          entity: "project-reports",
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
      await fetchDeleteV2AdminProjectReportsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminProjectReportsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminProjectReportsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminProjectReportsUUIDError);
    }
  }
};
