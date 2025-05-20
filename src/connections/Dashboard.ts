import { createSelector } from "reselect";

import {
  totalSectionHeaderControllerGetTotalSectionHeader,
  TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { TotalSectionHeaderDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import {
  totalSectionHeaderControllerGetTotalSectionHeaderFetchFailed,
  totalSectionHeaderControllerGetTotalSectionHeaderIsFetching
} from "@/generated/v3/dashboardService/dashboardServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type TotalSectionHeaderConnection = {
  data?: TotalSectionHeaderDto;
  fetchFailure?: PendingErrorState | null;
  isFetching: boolean;
  refetch: () => void;
};

export type SupportedEntity = TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams;

export type TotalSectionHeaderConnectionProps = {
  queryParams: TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams;
};

// const specificDashboardParams = (params: TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams) => ({
//   queryParams: { params }
// });

// const dashboardQuery = (props?: TotalSectionHeaderConnectionProps) => {
//   const queryParams = {
//     "page[number]": props?.queryParams["page[number]"],
//     "page[size]": props?.queryParams["page[size]"],
//     sideloads: props?.queryParams
//   } as TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams;
//   if (props?.queryParams?.["sort[field]"] != null) {
//     queryParams["sort[field]"] = props.queryParams?.["sort[field]"];
//     queryParams["sort[direction]"] = props.queryParams?.["sort[direction]"] ?? "ASC";
//   }

//   return queryParams;
// };

// const dashboardParams = (props?: TotalSectionHeaderConnectionProps) => ({
//   queryParams: dashboardQuery(props)
// });

// const dashboardIsLoaded =
//   (requireFullEntity: boolean) =>
//   <T extends TotalSectionHeaderDto>({ data, fetchFailure }: TotalSectionHeaderConnection) => {
//     if (fetchFailure != null) return true;
//     if (data == null) return false;
//     return !requireFullEntity || !data;
//   };

const dashboardIsLoaded =
  (requireFullEntity: boolean) =>
  ({ data, fetchFailure }: TotalSectionHeaderConnection) => {
    if (fetchFailure != null) return true;
    if (data == null) return false;

    if (!requireFullEntity) return true;

    return true;
  };

const indexCacheKey = (props: TotalSectionHeaderConnectionProps) => getStableQuery(props);

const totalSectionHeaderConnection: Connection<TotalSectionHeaderConnection, TotalSectionHeaderConnectionProps> = {
  load: (connection, props) => {
    if (!dashboardIsLoaded(true)(connection)) {
      totalSectionHeaderControllerGetTotalSectionHeader({ queryParams: props.queryParams });
    }
  },

  isLoaded: dashboardIsLoaded(true),

  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          (store: ApiDataStore) => store.totalSectionHeaders?.[indexCacheKey(props)]?.attributes,
          totalSectionHeaderControllerGetTotalSectionHeaderIsFetching({ queryParams: props.queryParams }),
          totalSectionHeaderControllerGetTotalSectionHeaderFetchFailed({ queryParams: props.queryParams })
        ],
        (data, isFetching, fetchFailure) => ({
          data,
          isFetching,
          fetchFailure,
          refetch: () => {
            ApiSlice.pruneCache("totalSectionHeaders", [indexCacheKey(props)]);
          }
        })
      )
  )
};

export const loadTotalSectionHeader = connectionLoader(totalSectionHeaderConnection);
export const useTotalSectionHeader = connectionHook(totalSectionHeaderConnection);
