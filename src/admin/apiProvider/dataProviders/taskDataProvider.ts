import { DataProvider } from "react-admin";

import { getFormattedErrorForRA, v3ErrorForRA } from "@/admin/apiProvider/utils/error";
import { raConnectionProps } from "@/admin/apiProvider/utils/listing";
import { loadTasks } from "@/connections/Task";
import { fetchGetV2TasksUUID, GetV2TasksUUIDError } from "@/generated/apiComponents";

export const taskDataProvider: DataProvider = {
  // @ts-expect-error until the types for this provider can be sorted out
  async getList(_, params) {
    const connection = await loadTasks(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Task index fetch failed", connection.fetchFailure);
    }

    const { tasks, indexTotal } = connection;
    return { data: tasks?.map(task => ({ ...task, id: task.uuid })) ?? [], total: indexTotal ?? 0 };
  },

  // @ts-expect-error until the types for this provider can be sorted out
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
