import { createSelector } from "reselect";

import {
  getTotalSectionHeaders,
  GetTotalSectionHeadersQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { getTotalSectionHeadersFetchFailed } from "@/generated/v3/dashboardService/dashboardServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

import { TotalSectionHeaderDto } from "../generated/v3/dashboardService/dashboardServiceSchemas";

export type HectareRestorationConnectionProps = Partial<GetTotalSectionHeadersQueryParams>;

export type HectareRestorationConnection = {
  data?: TotalSectionHeaderDto;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

const hectareRestorationIsLoaded = (connection: HectareRestorationConnection) =>
  connection.data != null || connection.fetchFailure != null;

const indexCacheKey = (props: HectareRestorationConnectionProps) =>
  getStableQuery(props as GetTotalSectionHeadersQueryParams);

const hectareRestorationConnection: Connection<HectareRestorationConnection, HectareRestorationConnectionProps> = {
  load: (connection, props) => {
    if (!hectareRestorationIsLoaded(connection)) {
      getTotalSectionHeaders({ queryParams: props });
    }
  },

  isLoaded: hectareRestorationIsLoaded,

  selector: selectorCache(
    props => indexCacheKey(props).replace(/%5B%5D/g, ""),
    props =>
      createSelector(
        [
          (store: ApiDataStore) => store.totalSectionHeaders?.[indexCacheKey(props).replace(/%5B%5D/g, "")]?.attributes,
          getTotalSectionHeadersFetchFailed({ queryParams: props })
        ],
        (indexMeta, fetchFailure) => {
          const refetch = () => ApiSlice.pruneIndex("totalSectionHeaders", "");
          if (indexMeta == null) return { refetch, fetchFailure };

          return {
            data: indexMeta as TotalSectionHeaderDto,
            fetchFailure,
            refetch
          };
        }
      )
  )
};

export const loadHectareRestoration = connectionLoader(hectareRestorationConnection);
export const useHectareRestoration = connectionHook(hectareRestorationConnection);
