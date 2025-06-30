import { DataProvider } from "react-admin";

import { deleteProject, loadFullProject, loadProjectIndex } from "@/connections/Entity";
import { fetchGetV2AdminProjectsMulti, GetV2AdminProjectsMultiError } from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";

// @ts-ignore
export const projectDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on Project DTOs
  async getList(_, params) {
    const connection = await loadProjectIndex(raConnectionProps(params));
    if (connection.loadFailure != null) {
      throw v3ErrorForRA("Project index fetch failed", connection.loadFailure);
    }

    return { data: connection.data?.map(project => ({ ...project, id: project.uuid })), total: connection.indexTotal };
  },

  // @ts-expect-error until we can get the whole DataProvider on Project DTOs
  async getOne(_, params) {
    const { data: project, loadFailure } = await loadFullProject({ id: params.id });
    if (loadFailure != null) {
      throw v3ErrorForRA("Project get fetch failed", loadFailure);
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

  // @ts-expect-error until we can get the whole DataProvider on Project DTOs
  async delete(_, params) {
    try {
      await deleteProject(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      return v3ErrorForRA("Project delete failed", err);
    }
  },

  // @ts-expect-error until we can get the whole DataProvider on Project DTOs
  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteProject(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      return v3ErrorForRA("Project delete failed", err);
    }
  }
};
