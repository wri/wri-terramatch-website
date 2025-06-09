import { createSelector } from "reselect";

import { approveReports, processProjectTasks } from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectTaskProcessingResponseDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  processProjectTasksFetchFailed,
  processProjectTasksIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, isPendingErrorState, PendingErrorState } from "@/store/apiSlice";
import ApiSlice from "@/store/apiSlice";
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

export type ApproveReportsConnection = {
  approveReports: (reportUuids: string[], comment?: string) => void;
  isApproving: boolean;
  approveFailure?: PendingErrorState | null;
};

export type ApproveReportsProps = {
  uuid?: string;
};

const approveReportsIsLoaded = () => true;

const approveReportsConnection: Connection<ApproveReportsConnection, ApproveReportsProps> = {
  load: () => {
    return;
  },

  isLoaded: approveReportsIsLoaded,

  selector: selectorCache(
    ({ uuid }) => uuid as string,
    ({ uuid }) =>
      createSelector(
        [
          (state: ApiDataStore) => Boolean(state.approveReportsResponse?.isFetching),
          (state: ApiDataStore) => {
            const failure = state.approveReportsResponse?.fetchFailure;
            if (!failure || !isPendingErrorState(failure)) return null;
            return failure;
          }
        ],
        (isApproving, approveFailure) => ({
          approveReports: (reportUuids: string[], comment?: string) => {
            if (!uuid) return;

            approveReports({
              body: {
                reportUuids,
                feedback: comment ?? "",
                uuid
              }
            });

            ApiSlice.pruneCache("processProjectTasks", [uuid]);
          },
          isApproving,
          approveFailure
        })
      )
  )
};

export const useApproveReports = connectionHook(approveReportsConnection);

export const loadProjectTaskProcessing = connectionLoader(projectTaskProcessingConnection);
export const useProjectTaskProcessing = connectionHook(projectTaskProcessingConnection);
