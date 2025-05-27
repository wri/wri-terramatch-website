import { DataProvider } from "react-admin";

import { v3ErrorForRA } from "@/admin/apiProvider/utils/error";
import { raConnectionProps } from "@/admin/apiProvider/utils/listing";
import { loadTask, loadTasks } from "@/connections/Task";

export const taskDataProvider: DataProvider = {
  // @ts-expect-error until the types for this provider can be sorted out
  async getList(_, params) {
    const { tasks, indexTotal, fetchFailure } = await loadTasks(raConnectionProps(params));
    if (fetchFailure != null) {
      throw v3ErrorForRA("Task index fetch failed", fetchFailure);
    }

    return { data: tasks?.map(task => ({ ...task, id: task.uuid })) ?? [], total: indexTotal ?? 0 };
  },

  // @ts-expect-error until the types for this provider can be sorted out
  async getOne(_, params) {
    const { task, projectReportUuid, siteReportUuids, nurseryReportUuids, fetchFailure } = await loadTask({
      uuid: params.id
    });
    if (fetchFailure != null) {
      throw v3ErrorForRA("Task get fetch failed", fetchFailure);
    }

    return { data: { ...task, projectReportUuid, siteReportUuids, nurseryReportUuids, id: task!.uuid } };
  }
};
