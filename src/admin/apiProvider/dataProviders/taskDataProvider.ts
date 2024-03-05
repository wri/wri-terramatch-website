import { DataProvider } from "react-admin";

import { getFormattedErrorForRA } from "@/admin/apiProvider/utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "@/admin/apiProvider/utils/listing";
import { fetchGetV2AdminTasks, GetV2AdminTasksError } from "@/generated/apiComponents";

const taskSortableList = ["organisation_name", "due_at"];

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
  }
};
