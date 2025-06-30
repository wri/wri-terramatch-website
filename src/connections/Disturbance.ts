import { createSelector } from "reselect";

import { disturbanceIndex, DisturbanceIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { DisturbanceDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  disturbanceIndexFetchFailed,
  disturbanceIndexIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import { ApiDataStore, PendingErrorState, StoreResource } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export const disturbanceSelector = (store: ApiDataStore) => Object.values(store.disturbances);

type DisturbanceConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean | null;
  data?: StoreResource<DisturbanceDto>[] | null;
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
  load: ({ isSuccess, requestFailed, data }, props) => {
    if (!data) disturbanceIndex(disturbanceIndexParams(props));
  },

  isLoaded: ({ data }) => data !== undefined,
  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          disturbanceIndexIsFetching(disturbanceIndexParams(props)),
          disturbanceIndexFetchFailed(disturbanceIndexParams(props)),
          disturbanceSelector
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          isSuccess: selector != null,
          data: selector
        })
      )
  )
};

export const useDisturbance = connectionHook(disturbanceConnection);
