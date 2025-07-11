import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  getHectaresRestoration,
  GetHectaresRestorationQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { HectareRestorationDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";

const hectareRestorationConnection = v3Resource("hectareRestoration", getHectaresRestoration)
  .singleByFilter<HectareRestorationDto, GetHectaresRestorationQueryParams>()
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables != null) {
      ApiSlice.pruneCache("hectareRestoration", [getStableQuery(variables)]);
    }
  })
  .buildConnection();

export const useHectareRestoration = connectionHook(hectareRestorationConnection);
