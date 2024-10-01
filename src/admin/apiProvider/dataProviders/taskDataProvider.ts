import { DataProvider } from "react-admin";

import { getFormattedErrorForRA } from "@/admin/apiProvider/utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "@/admin/apiProvider/utils/listing";
import {
  fetchGetV2AdminTasks,
  fetchGetV2TasksUUID,
  GetV2AdminTasksError,
  GetV2TasksUUIDError
} from "@/generated/apiComponents";

const taskSortableList = ["project_name", "organisation_name", "due_at", "updated_at"];

// @ts-ignore
export const taskDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminTasks({
        queryParams: raListParamsToQueryParams(params, taskSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminTasksError);
    }
  },

  // @ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2TasksUUID({
        pathParams: {
          uuid: params.id
        }
      });

      // @ts-ignore
      return { data: { ...response.data, id: response.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2TasksUUIDError);
    }
  }
};
