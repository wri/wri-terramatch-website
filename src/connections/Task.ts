import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  taskGet,
  TaskGetVariables,
  taskIndex,
  TaskIndexQueryParams,
  TaskIndexVariables,
  taskUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { TaskFullDto, TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  taskGetFetchFailed,
  taskIndexFetchFailed,
  taskIndexIndexMeta,
  taskUpdateFetchFailed,
  taskUpdateIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";

import { ApiConnectionFactory } from "./util/apiConnectionFactory";

type TaskIndexFilter = Omit<TaskIndexQueryParams, "page[size]" | "page[number]" | "sort[field]" | "sort[direction]">;

export const taskIndexConnection = ApiConnectionFactory.index<TaskLightDto, TaskIndexVariables>(
  "tasks",
  taskIndex,
  taskIndexIndexMeta
)
  .pagination()
  .loadFailure(taskIndexFetchFailed)
  .filter<TaskIndexFilter>()
  .buildConnection();

const taskConnection = ApiConnectionFactory.singleFullResource<TaskFullDto, TaskGetVariables>(
  "tasks",
  taskGet,
  ({ id }) =>
    id == null
      ? undefined
      : {
          pathParams: { uuid: id }
        }
)
  .loadFailure(taskGetFetchFailed)
  .update(taskUpdate, taskUpdateIsFetching, taskUpdateFetchFailed)
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
