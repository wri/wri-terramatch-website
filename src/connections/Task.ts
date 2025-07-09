import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  taskGet,
  taskIndex,
  TaskIndexQueryParams,
  taskUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { TaskFullDto, TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

import { v3Resource } from "./util/apiConnectionFactory";

export const taskIndexConnection = v3Resource("tasks", taskIndex)
  .index<TaskLightDto>()
  .pagination()
  .filter<Filter<TaskIndexQueryParams>>()
  .buildConnection();

const taskConnection = v3Resource("tasks", taskGet)
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
