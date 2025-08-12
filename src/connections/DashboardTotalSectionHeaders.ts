import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  getTotalSectionHeaders,
  GetTotalSectionHeadersQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { TotalSectionHeaderDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";

const totalSectionHeaderConnection = v3Resource("totalSectionHeaders", getTotalSectionHeaders)
  .singleByFilter<TotalSectionHeaderDto, GetTotalSectionHeadersQueryParams>()
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables != null) {
      ApiSlice.pruneCache("totalSectionHeaders", [getStableQuery(variables)]);
    }
  })
  .buildConnection();

export const useTotalSectionHeader = connectionHook(totalSectionHeaderConnection);
