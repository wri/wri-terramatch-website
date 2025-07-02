import { DataProvider } from "react-admin";

import { deleteProject, loadFullProject, loadProjectIndex } from "@/connections/Entity";
import { fetchGetV2AdminProjectsMulti, GetV2AdminProjectsMultiError } from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { connectionDataProvider } from "../utils/listing";

export const projectDataProvider: Partial<DataProvider> = {
  ...connectionDataProvider("Project", loadProjectIndex, loadFullProject, deleteProject),

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
  }
};
