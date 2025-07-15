import { isEmpty } from "lodash";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import {
  getHectaresRestoration,
  GetHectaresRestorationQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { HectareRestorationDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { getStableQuery } from "@/generated/v3/utils";
import { useConnection } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";

const hasValidParams = ({ projectUuid, landscapes, country }: GetHectaresRestorationQueryParams = {}): boolean =>
  !isEmpty(projectUuid) || !isEmpty(landscapes) || !isEmpty(country);

const hectareRestorationConnection = v3Resource("hectareRestoration", getHectaresRestoration)
  .singleByFilter<HectareRestorationDto, GetHectaresRestorationQueryParams>()
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables != null) {
      ApiSlice.pruneCache("hectareRestoration", [getStableQuery(variables)]);
    }
  })
  .buildConnection();

export const useHectareRestoration = (filter: GetHectaresRestorationQueryParams) => {
  const result = useConnection(hectareRestorationConnection, { filter, enabled: hasValidParams(filter) });
  return result[1].data;
};
