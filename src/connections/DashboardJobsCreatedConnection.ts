import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  getTotalJobsCreated,
  GetTotalJobsCreatedQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { TotalJobsCreatedDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";

const jobsCreatedConnection = v3Resource("totalJobsCreated", getTotalJobsCreated)
  .singleByFilter<TotalJobsCreatedDto, GetTotalJobsCreatedQueryParams>()
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables != null) {
      ApiSlice.pruneCache("totalJobsCreated", [getStableQuery(variables)]);
    }
  })
  .buildConnection();

export const useJobsCreated = connectionHook(jobsCreatedConnection);
