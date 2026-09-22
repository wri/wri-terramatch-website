import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  taskGet,
  taskIndex,
  TaskIndexQueryParams,
  taskUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { TaskFullDto, TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Relationships } from "@/store/apiSlice";
import { Filter } from "@/types/connection";

import { v3Resource } from "./util/apiConnectionFactory";

export type TaskRelationships = {
  projectReportUuid?: string;
  siteReportUuids?: string[];
  nurseryReportUuids?: string[];
  srpReportUuids?: string[];
};

const selectRelationships = (relationships?: Relationships): TaskRelationships => {
  if (relationships == null) return {};
  return {
    projectReportUuid: relationships["projectReport"]?.[0]?.id,
    siteReportUuids: (relationships["siteReports"] ?? []).map(({ id }) => id!),
    nurseryReportUuids: (relationships["nurseryReports"] ?? []).map(({ id }) => id!),
    srpReportUuids: (relationships["srpReports"] ?? []).map(({ id }) => id!)
  };
};

export const taskIndexConnection = v3Resource("tasks", taskIndex)
  .indexWithRelationships<TaskLightDto, TaskRelationships>(selectRelationships)
  .pagination()
  .filter<Filter<Omit<TaskIndexQueryParams, "sideloadReports">>>()
  .addProps<{ sideloadReports?: boolean }>(({ sideloadReports }) => ({ queryParams: { sideloadReports } }))
  .buildConnection();

const taskConnection = v3Resource("tasks", taskGet)
  .singleFullResource<TaskFullDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .update(taskUpdate)
  .addRelationshipData(selectRelationships)
  .buildConnection();

export const loadTasks = connectionLoader(taskIndexConnection);

export const loadTask = connectionLoader(taskConnection);
export const useTask = connectionHook(taskConnection);
