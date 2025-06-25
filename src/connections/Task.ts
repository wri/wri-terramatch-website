import { createSelector } from "reselect";

import {
  taskGet,
  taskIndex,
  TaskIndexVariables,
  taskUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { TaskFullDto, TaskLightDto, TaskUpdateAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  taskGetFetchFailed,
  taskIndexFetchFailed,
  taskIndexIndexMeta,
  taskUpdateFetchFailed,
  taskUpdateIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

import { ApiConnectionFactory } from "./util/api-connection-factory";

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

const taskParams = ({ uuid }: TaskProps) => ({ pathParams: { uuid: uuid ?? "" } });
const taskIsLoaded = ({ task, fetchFailure }: TaskConnection, { uuid }: TaskProps) => {
  if (uuid == null || fetchFailure != null) return true;
  return task != null && !task.lightResource;
};

const updateTask = (uuid: string, update: TaskUpdateAttributes) => {
  taskUpdate({ ...taskParams({ uuid }), body: { data: { id: uuid, type: "tasks", attributes: update } } });
};

export const taskIndexConnection = ApiConnectionFactory.index<TaskLightDto, TaskIndexVariables>(
  "tasks",
  taskIndex,
  taskIndexIndexMeta
)
  .pagination()
  .fetchFailure(taskIndexFetchFailed)
  .filters({
    status: "string",
    frameworkKey: "string",
    projectUuid: "string"
  })
  .buildConnection();

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
