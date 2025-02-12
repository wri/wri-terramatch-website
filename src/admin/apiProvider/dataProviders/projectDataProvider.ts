import { DataProvider, HttpError } from "react-admin";

import { loadProject } from "@/connections/Entity";
import {
  DeleteV2AdminProjectsUUIDError,
  fetchDeleteV2AdminProjectsUUID,
  fetchGetV2AdminProjects,
  fetchGetV2AdminProjectsMulti,
  GetV2AdminProjectsError,
  GetV2AdminProjectsMultiError
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
    const { entity: project, fetchFailure } = await loadProject({ uuid: params.id });
    if (fetchFailure != null) {
      throw new HttpError(fetchFailure.message, fetchFailure.statusCode);
    }

    return { data: { ...project, uuid: params.id, id: params.id } };
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
