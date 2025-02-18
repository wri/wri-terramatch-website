import { DataProvider, HttpError } from "react-admin";

import { loadFullProject, loadProjectIndex } from "@/connections/Entity";
import {
  DeleteV2AdminProjectsUUIDError,
  fetchDeleteV2AdminProjectsUUID,
  fetchGetV2AdminProjectsMulti,
  GetV2AdminProjectsMultiError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

const projectSortableList = ["name", "organisation_name", "planting_start_date"];

// @ts-ignore
export const projectDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on Project DTOs
  async getList(_, params) {
    const connection = await loadProjectIndex(raConnectionProps(params, projectSortableList));
    if (connection.fetchFailure != null) {
      throw new HttpError(connection.fetchFailure.message, connection.fetchFailure.statusCode);
    }

    return entitiesListResult(connection);
  },

  // @ts-expect-error until we can get the whole DataProvider on Project DTOs
  async getOne(_, params) {
    const { entity: project, fetchFailure } = await loadFullProject({ uuid: params.id });
    if (fetchFailure != null) {
      throw new HttpError(fetchFailure.message, fetchFailure.statusCode);
    }

    return { data: { ...project, id: project!.uuid } };
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
