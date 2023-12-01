import { DataProvider } from "react-admin";

import {
  DeleteV2AdminNurseryReportsUUIDError,
  fetchDeleteV2AdminNurseryReportsUUID,
  fetchGetV2AdminNurseryReports,
  fetchGetV2ENTITYUUID,
  GetV2AdminNurseryReportsError,
  GetV2ENTITYUUIDError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

const nurseryReportSortableList = ["title", "project_name", "organisation_name", "due_at", "submitted_at"];

// @ts-ignore
export const nurseryReportDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminNurseryReports({
        queryParams: raListParamsToQueryParams(params, nurseryReportSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminNurseryReportsError);
    }
  },

  // @ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2ENTITYUUID({
        pathParams: {
          entity: "nursery-reports",
          uuid: params.id
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
      await fetchDeleteV2AdminNurseryReportsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminNurseryReportsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminNurseryReportsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminNurseryReportsUUIDError);
    }
  }
};
