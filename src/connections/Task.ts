import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  taskGet,
  taskIndex,
  TaskIndexQueryParams,
  taskUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { TaskFullDto, TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3Endpoint } from "./util/apiConnectionFactory";

type TaskIndexFilter = Omit<TaskIndexQueryParams, "page[size]" | "page[number]" | "sort[field]" | "sort[direction]">;

export const taskIndexConnection = v3Endpoint("tasks", taskIndex)
  .index<TaskLightDto>()
  .pagination()
  .filter<TaskIndexFilter>()
  .buildConnection();

const taskConnection = v3Endpoint("tasks", taskGet)
  .singleFullResource<TaskFullDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .update(taskUpdate)
  .addRelationshipData(relationships => {
    if (relationships == null) return {};
    return {
      projectReportUuid: relationships["projectReport"]?.[0]?.id,
      siteReportUuids: (relationships["siteReports"] ?? []).map(({ id }) => id!),
      nurseryReportUuids: (relationships["nurseryReports"] ?? []).map(({ id }) => id!)
    };
  })
  .buildConnection();

export const loadTasks = connectionLoader(taskIndexConnection);

export const loadTask = connectionLoader(taskConnection);
export const useTask = connectionHook(taskConnection);
