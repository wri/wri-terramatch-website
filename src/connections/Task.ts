import { createSelector } from "reselect";

import { PaginatedConnectionProps } from "@/connections/util/types";
import { taskGet, taskIndex, TaskIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { TaskFullDto, TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  taskGetFetchFailed,
  taskIndexFetchFailed,
  taskIndexIndexMeta
} from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
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
};

export type TaskProps = {
  uuid: string;
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

const taskParams = ({ uuid }: TaskProps) => ({ pathParams: { uuid } });
const taskIsLoaded = ({ task, fetchFailure }: TaskConnection, { uuid }: TaskProps) => {
  if (uuid == null || fetchFailure != null) return true;
  return task != null && !task.lightResource;
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
            tasks.push(tasksStore[id].attributes);
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
        [({ tasks }: ApiDataStore) => tasks, taskGetFetchFailed(taskParams(props))],
        (tasks, fetchFailure) => {
          const taskResponse = tasks[props.uuid];
          if (taskResponse == null) return { fetchFailure };

          const projectReportUuid = taskResponse?.relationships?.["projectReport"]?.[0]?.id;
          const siteReportUuids = (taskResponse?.relationships?.["siteReports"] ?? []).map(({ id }) => id!);
          const nurseryReportUuids = (taskResponse?.relationships?.["nurseryReports"] ?? []).map(({ id }) => id!);
          return {
            task: taskResponse?.attributes as TaskFullDto,
            projectReportUuid,
            siteReportUuids,
            nurseryReportUuids,
            fetchFailure
          };
        }
      )
  )
};

export const loadTasks = connectionLoader(taskIndexConnection);

export const loadTask = connectionLoader(taskConnection);
