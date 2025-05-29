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
      try {
        const result = getTotalSectionHeaders({ queryParams: props });
        if (result === undefined) {
          return {
            ...connection,
            fetchFailure: {
              statusCode: 404,
              message: "No data available for this combination of filters",
              severity: "error"
            }
          };
        }
      } catch (error) {
        return {
          ...connection,
          fetchFailure: {
            statusCode: 500,
            message: error instanceof Error ? error.message : "Unknown error",
            severity: "error"
          }
        };
      }
    }
  },

  isLoaded: totalSectionHeaderIsLoaded,

  selector: selectorCache(
    props => indexCacheKey(props)?.replace(/%5B%5D/g, ""),
    props =>
      createSelector(
        [
          (store: ApiDataStore) =>
            store.totalSectionHeaders?.[indexCacheKey(props)?.replace(/%5B%5D/g, "")]?.attributes,
          getTotalSectionHeadersFetchFailed({ queryParams: props })
        ],
        (indexMeta, fetchFailure) => {
          const refetch = () => ApiSlice.pruneIndex("totalSectionHeaders", "");

          if (indexMeta == null) {
            return {
              refetch,
              fetchFailure: fetchFailure || {
                statusCode: 404,
                message: "No data available for this combination of filters",
                severity: "error"
              }
            };
          }

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
