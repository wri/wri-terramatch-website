import { createSelector } from "reselect";

import { disturbanceIndex, DisturbanceIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { verifyUserFetchFailed, verifyUserIsFetching } from "@/generated/v3/userService/userServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const selectVerificationUser = (store: ApiDataStore) => Object.values(store.verifications)?.[0]?.attributes;

type DisturbanceConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean | null;
};

type DisturbanceProps = {
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  siteReportUuid: string[];
};

const disturbanceIndexQuery = (props?: DisturbanceProps) => {
  const queryParams = {
    "page[number]": props?.pageNumber,
    "page[size]": props?.pageSize
  } as DisturbanceIndexQueryParams;
  if (props?.sortField != null) {
    queryParams["sort[field]"] = props.sortField;
    queryParams["sort[direction]"] = props.sortDirection ?? "ASC";
  }
  if (props?.siteReportUuid != null && props.siteReportUuid.length > 0) {
    queryParams.siteReportUuid = props.siteReportUuid;
  }
  return queryParams;
};

const disturbanceIndexParams = (props?: DisturbanceProps) => ({
  queryParams: disturbanceIndexQuery(props)
});

const indexCacheKey = (props: DisturbanceProps) => getStableQuery(disturbanceIndexQuery(props));

const disturbanceConnection: Connection<DisturbanceConnection, DisturbanceProps> = {
  load: ({ isSuccess, requestFailed }, props) => {
    if (isSuccess == null && requestFailed == null) disturbanceIndex(disturbanceIndexParams(props));
  },

  isLoaded: ({ isSuccess }) => isSuccess !== null,
  selector: selectorCache(
    props => indexCacheKey(props),
    ({ siteReportUuid }) =>
      createSelector(
        [verifyUserIsFetching, verifyUserFetchFailed, selectVerificationUser],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector?.verified
        })
      )
  )
};

export const useDisturbance = connectionLoader(disturbanceConnection);
