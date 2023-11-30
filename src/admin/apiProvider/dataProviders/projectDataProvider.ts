import { DataProvider } from "react-admin";

import {
  DeleteV2AdminProjectsUUIDError,
  fetchDeleteV2AdminProjectsUUID,
  fetchGetV2AdminProjects,
  fetchGetV2AdminProjectsMulti,
  fetchGetV2ENTITYUUID,
  GetV2AdminProjectsError,
  GetV2AdminProjectsMultiError,
  GetV2ENTITYUUIDError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

const projectSortableList = ["name", "organisation_name", "planting_start_date"];

// @ts-ignore
export const projectDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminProjects({
        queryParams: raListParamsToQueryParams(params, projectSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminProjectsError);
    }
  },

  // @ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2ENTITYUUID({
        pathParams: {
          entity: "projects",
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
  async getMany(_, params) {
    try {
      const response = await fetchGetV2AdminProjectsMulti({
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
      throw getFormattedErrorForRA(err as GetV2AdminProjectsMultiError);
    }
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminProjectsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminProjectsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminProjectsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminProjectsUUIDError);
    }
  }
};
