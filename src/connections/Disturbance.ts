import { createSelector } from "reselect";

import { connectionHook } from "@/connections/util/connectionShortcuts";
import { disturbanceIndex, DisturbanceIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { DisturbanceDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getStableQuery } from "@/generated/v3/utils";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

export const disturbanceSelector = (store: ApiDataStore) =>
  Object.values(store.disturbances)?.map(resource => resource.attributes) ?? [];

type DisturbanceConnection = {
  isLoading: boolean;
  requestFailed: PendingError | undefined;
  data?: DisturbanceDto[] | null;
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

const disturbanceIsLoaded = ({ requestFailed, data }: DisturbanceConnection) =>
  requestFailed != null || (data != null && data.length > 0);

const disturbanceConnection: Connection<DisturbanceConnection, DisturbanceProps> = {
  load: (connection, props) => {
    if (!disturbanceIsLoaded(connection)) disturbanceIndex.fetch(disturbanceIndexParams(props));
  },

  isLoaded: disturbanceIsLoaded,
  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          disturbanceIndex.isFetchingSelector(disturbanceIndexParams(props)),
          disturbanceIndex.fetchFailedSelector(disturbanceIndexParams(props)),
          disturbanceSelector
        ],
        (isLoading, requestFailed, selector) => ({
          isLoading,
          requestFailed,
          data: selector
        })
      )
  )
};

export const useDisturbance = connectionHook(disturbanceConnection);
