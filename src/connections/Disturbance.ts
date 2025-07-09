import { connectionHook } from "@/connections/util/connectionShortcuts";
import { disturbanceIndex, DisturbanceIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { DisturbanceDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

import { v3Resource } from "./util/apiConnectionFactory";

const disturbanceConnection = v3Resource("disturbances", disturbanceIndex)
  .index<DisturbanceDto>()
  .pagination()
  .filter<Filter<DisturbanceIndexQueryParams>>()
  .buildConnection();

export const useDisturbance = connectionHook(disturbanceConnection);
