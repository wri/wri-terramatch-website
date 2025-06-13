import { createSelector } from "reselect";

import { processbulkApproval } from "@/generated/v3/entityService/entityServiceComponents";
import {
  processbulkApprovalFetchFailed,
  processbulkApprovalIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

import { ProcessBulkApprovalDto } from "../generated/v3/entityService/entityServiceSchemas";

export type ProcessBulkApprovalConnection = {
  data?: ProcessBulkApprovalDto;
  fetchFailure?: PendingErrorState | null;
  isLoading: boolean;
};

export type ProcessBulkApprovalProps = {
  uuid: string;
};

const processBulkApprovalIsLoaded = ({ data, fetchFailure }: ProcessBulkApprovalConnection) =>
  data != null || fetchFailure != null;

const processBulkApprovalConnection: Connection<ProcessBulkApprovalConnection, ProcessBulkApprovalProps> = {
  load: (connection, { uuid }) => {
    if (!processBulkApprovalIsLoaded(connection) && uuid !== undefined) {
      processbulkApproval({
        pathParams: {
          uuid
        }
      });
    }
  },

  isLoaded: processBulkApprovalIsLoaded,

  selector: selectorCache(
    ({ uuid }: ProcessBulkApprovalProps) => uuid,
    ({ uuid }: ProcessBulkApprovalProps) =>
      createSelector(
        [
          processbulkApprovalIsFetching({ pathParams: { uuid } }),
          processbulkApprovalFetchFailed({ pathParams: { uuid } }),
          ({ processBulkApproval }: ApiDataStore) => processBulkApproval
        ],
        (isLoading, fetchFailure, store) => ({
          data: store[uuid]?.attributes,
          fetchFailure,
          isLoading
        })
      )
  )
};

export const loadProcessBulkApproval = connectionLoader(processBulkApprovalConnection);
export const useProcessBulkApproval = connectionHook(processBulkApprovalConnection);
