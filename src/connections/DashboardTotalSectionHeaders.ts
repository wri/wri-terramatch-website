import { ApiConnectionFactory } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  getTotalSectionHeaders,
  GetTotalSectionHeadersQueryParams,
  GetTotalSectionHeadersVariables
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { TotalSectionHeaderDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { getTotalSectionHeadersFetchFailed } from "@/generated/v3/dashboardService/dashboardServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";

const totalSectionHeaderConnection = ApiConnectionFactory.singleByFilter<
  TotalSectionHeaderDto,
  GetTotalSectionHeadersVariables,
  GetTotalSectionHeadersQueryParams
>("totalSectionHeaders", getTotalSectionHeaders)
  .loadFailure(getTotalSectionHeadersFetchFailed)
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables != null) {
      ApiSlice.pruneCache("totalSectionHeaders", [getStableQuery(variables)]);
    }
  })
  .buildConnection();

export const useTotalSectionHeader = connectionHook(totalSectionHeaderConnection);
