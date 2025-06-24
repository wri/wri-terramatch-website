import { createSelector } from "reselect";

import { PaginatedConnectionProps } from "@/connections/util/types";
import {
  taskGet,
  taskIndex,
  TaskIndexQueryParams,
  taskUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  NurseryReportLightDto,
  SiteReportLightDto,
  TaskFullDto,
  TaskLightDto,
  TaskUpdateAttributes
} from "@/generated/v3/entityService/entityServiceSchemas";
import {
  taskGetFetchFailed,
  taskIndexFetchFailed,
  taskIndexIndexMeta,
  taskUpdateFetchFailed,
  taskUpdateIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type TaskIndexConnection = {
  tasks?: TaskLightDto[];
  indexTotal?: number;
  fetchFailure?: PendingErrorState | null;
};

type TaskIndexFilterKey = keyof Omit<
  TaskIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;
export type TaskIndexProps = PaginatedConnectionProps & {
  filter?: Partial<Record<TaskIndexFilterKey, string>>;
};

export type TaskConnection = {
  task?: TaskFullDto;
  projectReportUuid?: string;
  siteReportUuids?: string[];
  nurseryReportUuids?: string[];
  fetchFailure?: PendingErrorState | null;

  taskIsUpdating: boolean;
  taskUpdateFailure?: PendingErrorState | null;
  submitForApproval?: () => void;
};

export type TaskProps = {
  uuid?: string | null;
};

const taskIndexQuery = (props?: TaskIndexProps) => {
  const query = {
    "page[number]": props?.pageNumber,
    "page[size]": props?.pageSize
  } as TaskIndexQueryParams;

  if (props?.filter != null) {
    for (const [key, value] of Object.entries(props.filter)) {
      query[key as TaskIndexFilterKey] = value;
    }
  }

  if (props?.sortField != null) {
    query["sort[field]"] = props.sortField;
    query["sort[direction]"] = props.sortDirection ?? "ASC";
  }

  return query;
};
const taskIndexParams = (props?: TaskIndexProps) => ({ queryParams: taskIndexQuery(props) });
const indexIsLoaded = ({ tasks, fetchFailure }: TaskIndexConnection) => tasks != null || fetchFailure != null;

const taskParams = ({ uuid }: TaskProps) => ({ pathParams: { uuid: uuid ?? "" } });
const taskIsLoaded = ({ task, fetchFailure }: TaskConnection, { uuid }: TaskProps) => {
  if (uuid == null || fetchFailure != null) return true;
  return task != null && !task.lightResource;
};

const updateTask = (uuid: string, update: TaskUpdateAttributes) => {
  taskUpdate({ ...taskParams({ uuid }), body: { data: { id: uuid, type: "tasks", attributes: update } } });
};

export const taskIndexConnection: Connection<TaskIndexConnection, TaskIndexProps> = {
  load: (connection, props) => {
    if (!indexIsLoaded(connection)) taskIndex(taskIndexParams(props));
  },

  isLoaded: indexIsLoaded,

  selector: selectorCache(
    props => getStableQuery(taskIndexQuery(props)),
    props =>
      createSelector(
        [
          taskIndexIndexMeta("tasks", taskIndexParams(props)),
          ({ tasks }: ApiDataStore) => tasks,
          taskIndexFetchFailed(taskIndexParams(props))
        ],
        (indexMeta, tasksStore, fetchFailure) => {
          if (indexMeta == null) return { fetchFailure };

          const tasks: TaskLightDto[] = [];
          for (const id of indexMeta.ids) {
            if (tasksStore[id] == null) return { fetchFailure };
            const task = tasksStore[id];

            const siteReports = indexMeta?.included?.filter(report => report.type == "siteReports");
            const nurseryReports = indexMeta?.included?.filter(report => report.type == "nurseryReports");

            const taskWithRelationships = {
              ...task.attributes,
              siteReports,
              nurseryReports
            } as TaskLightDto & { siteReports: SiteReportLightDto[]; nurseryReports: NurseryReportLightDto[] };

            tasks.push(taskWithRelationships);
          }

          return { tasks, indexTotal: indexMeta?.total, fetchFailure };
        }
      )
  )
};

const taskConnection: Connection<TaskConnection, TaskProps> = {
  load: (connection, props) => {
    if (!taskIsLoaded(connection, props)) taskGet(taskParams(props));
  },

  isLoaded: taskIsLoaded,

  selector: selectorCache(
    ({ uuid }) => uuid ?? "",
    props =>
      createSelector(
        [
          ({ tasks }: ApiDataStore) => tasks,
          taskGetFetchFailed(taskParams(props)),
          taskUpdateIsFetching(taskParams(props)),
          taskUpdateFetchFailed(taskParams(props))
        ],
        (tasks, fetchFailure, taskIsUpdating, taskUpdateFailure) => {
          const taskResponse = tasks[props.uuid ?? ""];
          if (taskResponse == null) return { fetchFailure, taskIsUpdating: false };

          const projectReportUuid = taskResponse?.relationships?.["projectReport"]?.[0]?.id;
          const siteReportUuids = (taskResponse?.relationships?.["siteReports"] ?? []).map(({ id }) => id!);
          const nurseryReportUuids = (taskResponse?.relationships?.["nurseryReports"] ?? []).map(({ id }) => id!);
          return {
            task: taskResponse?.attributes as TaskFullDto,
            projectReportUuid,
            siteReportUuids,
            nurseryReportUuids,
            fetchFailure,

            taskIsUpdating,
            taskUpdateFailure,

            submitForApproval: () => updateTask(taskResponse.attributes.uuid, { status: "awaiting-approval" })
          };
        }
      )
  )
};

export const loadTasks = connectionLoader(taskIndexConnection);

export const loadTask = connectionLoader(taskConnection);
export const useTask = connectionHook(taskConnection);
