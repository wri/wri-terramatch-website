import { createSelector } from "reselect";

import { approveReports, processProjectTasks } from "@/generated/v3/entityService/entityServiceComponents";
import {
  ApproveReportsResponseDto,
  ProjectTaskProcessingResponseDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import {
  approveReportsFetchFailed,
  approveReportsIsFetching,
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

export type ApproveReportsConnection = {
  data?: ApproveReportsResponseDto;
  fetchFailure?: PendingErrorState | null;
  isLoading: boolean;
  approveReports: (reportUuids: string[], feedback?: string) => void;
};

export type ApproveReportsProps = {
  uuid: string;
};

const approveReportsIsLoaded = ({ data, fetchFailure }: ApproveReportsConnection) =>
  data != null || fetchFailure != null;

const approveReportsConnection: Connection<ApproveReportsConnection, ApproveReportsProps> = {
  load: (connection, { uuid }) => {
    // Don't load anything on initial connection
    return;
  },

  isLoaded: approveReportsIsLoaded,

  selector: selectorCache(
    ({ uuid }: ApproveReportsProps) => uuid,
    ({ uuid }: ApproveReportsProps) =>
      createSelector(
        [
          approveReportsIsFetching,
          approveReportsFetchFailed,
          ({ approveReportsResponse }: ApiDataStore) => approveReportsResponse
        ],
        (isLoading, fetchFailure, store) => ({
          data: store["approveReports"]?.attributes,
          fetchFailure,
          isLoading,
          approveReports: (reportUuids: string[], feedback?: string) => {
            console.log("Calling approveReports with:", { reportUuids, feedback, uuid });
            approveReports({
              body: {
                reportUuids,
                feedback: feedback || "",
                uuid
              }
            });
          }
        })
      )
  )
};

export const loadProjectTaskProcessing = connectionLoader(projectTaskProcessingConnection);
export const useProjectTaskProcessing = connectionHook(projectTaskProcessingConnection);
export const useApproveReports = connectionHook(approveReportsConnection);
