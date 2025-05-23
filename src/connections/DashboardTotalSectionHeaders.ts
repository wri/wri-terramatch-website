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

export type TotalSectionHeaderConnectionProps = Partial<GetTotalSectionHeadersQueryParams>;

export type TotalSectionHeaderConnection = {
  data?: TotalSectionHeaderDto;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

const totalSectionHeaderIsLoaded = (connection: TotalSectionHeaderConnection) =>
  connection.data != null || connection.fetchFailure != null;

const indexCacheKey = (props: TotalSectionHeaderConnectionProps) =>
  getStableQuery(props as GetTotalSectionHeadersQueryParams);

const totalSectionHeaderConnection: Connection<TotalSectionHeaderConnection, TotalSectionHeaderConnectionProps> = {
  load: (connection, props) => {
    if (!totalSectionHeaderIsLoaded(connection)) {
      getTotalSectionHeaders({ queryParams: props });
    }
  },

  isLoaded: totalSectionHeaderIsLoaded,

  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          (store: ApiDataStore) => store.totalSectionHeaders?.[getStableQuery(props)]?.attributes,
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

export const loadTotalSectionHeader = connectionLoader(totalSectionHeaderConnection);
export const useTotalSectionHeader = connectionHook(totalSectionHeaderConnection);
