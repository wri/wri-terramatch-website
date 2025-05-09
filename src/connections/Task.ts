import { createSelector } from "reselect";

import { taskIndex, TaskIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { TaskDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { taskIndexFetchFailed, taskIndexIndexMeta } from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type TaskIndexConnection = {
  tasks?: TaskDto[];
  indexTotal?: number;
  fetchFailure?: PendingErrorState | null;
};

type TaskIndexFilterKey = keyof Omit<
  TaskIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;
export type TaskIndexProps = {
  pageSize?: number;
  pageNumber?: number;
  filter?: Partial<Record<TaskIndexFilterKey, string>>;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
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

const taskIndexConnection: Connection<TaskIndexConnection, TaskIndexProps> = {
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

          const tasks: TaskDto[] = [];
          for (const id of indexMeta.ids) {
            if (tasksStore[id] == null) return { fetchFailure };
            tasks.push(tasksStore[id].attributes);
          }

          return { tasks, indexTotal: indexMeta?.total, fetchFailure };
        }
      )
  )
};

export const loadTasks = connectionLoader(taskIndexConnection);
