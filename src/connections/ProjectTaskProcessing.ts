import { createSelector } from "reselect";

import { processProjectTasks } from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectTaskProcessingResponseDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  processProjectTasksFetchFailed,
  processProjectTasksIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type ProjectTaskProcessingConnection = {
  data?: ProjectTaskProcessingResponseDto;
  fetchFailure?: PendingErrorState | null;
  isLoading: boolean;
};

export type ProjectTaskProcessingProps = {
  uuid: string;
};

const projectTaskProcessingIsLoaded = ({ data, fetchFailure }: ProjectTaskProcessingConnection) =>
  data != null || fetchFailure != null;

const projectTaskProcessingConnection: Connection<ProjectTaskProcessingConnection, ProjectTaskProcessingProps> = {
  load: (connection, { uuid }) => {
    if (!projectTaskProcessingIsLoaded(connection) && uuid !== undefined) {
      processProjectTasks({
        pathParams: {
          uuid
        }
      });
    }
  },

  isLoaded: projectTaskProcessingIsLoaded,

  selector: selectorCache(
    ({ uuid }: ProjectTaskProcessingProps) => uuid,
    ({ uuid }: ProjectTaskProcessingProps) =>
      createSelector(
        [
          processProjectTasksIsFetching({ pathParams: { uuid } }),
          processProjectTasksFetchFailed({ pathParams: { uuid } }),
          ({ processProjectTasks }: ApiDataStore) => processProjectTasks
        ],
        (isLoading, fetchFailure, store) => ({
          data: store[uuid]?.attributes,
          fetchFailure,
          isLoading
        })
      )
  )
};

export const loadProjectTaskProcessing = connectionLoader(projectTaskProcessingConnection);
export const useProjectTaskProcessing = connectionHook(projectTaskProcessingConnection);
