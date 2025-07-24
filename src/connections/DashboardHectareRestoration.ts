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

const hasValidParams = ({
  projectUuid,
  country,
  cohort,
  landscapes,
  "organisationType[]": organisationType,
  "programmesType[]": programmesType
}: GetHectaresRestorationQueryParams = {}): boolean =>
  !isEmpty(projectUuid) ||
  !isEmpty(country) ||
  !isEmpty(cohort) ||
  !isEmpty(landscapes) ||
  !isEmpty(organisationType) ||
  !isEmpty(programmesType);

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
  return useConnection(hectareRestorationConnection, { filter, enabled: hasValidParams(filter) });
};
