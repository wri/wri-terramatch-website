import { DataProvider } from "react-admin";

import { v3ErrorForRA } from "@/admin/apiProvider/utils/error";
import { raConnectionProps } from "@/admin/apiProvider/utils/listing";
import { loadTask, loadTasks } from "@/connections/Task";

export const taskDataProvider: DataProvider = {
  // @ts-expect-error until the types for this provider can be sorted out
  async getList(_, params) {
    const { data, indexTotal, loadFailure } = await loadTasks(raConnectionProps(params));
    if (loadFailure != null) {
      throw v3ErrorForRA("Task index fetch failed", loadFailure);
    }

    return { data: data?.map(task => ({ ...task, id: task.uuid })) ?? [], total: indexTotal ?? 0 };
  },

  // @ts-expect-error until the types for this provider can be sorted out
  async getOne(_, params) {
    const {
      data: task,
      projectReportUuid,
      siteReportUuids,
      nurseryReportUuids,
      loadFailure
    } = await loadTask({
      id: params.id
    });
    if (loadFailure != null) {
      throw v3ErrorForRA("Task get fetch failed", loadFailure);
    }

    return { data: { ...task, projectReportUuid, siteReportUuids, nurseryReportUuids, id: task!.uuid } };
  }
};
