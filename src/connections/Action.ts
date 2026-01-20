import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { indexMyActions, IndexMyActionsQueryParams } from "@/generated/v3/userService/userServiceComponents";
import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";
import { Filter } from "@/types/connection";

const myActionsConnection = v3Resource("actions", indexMyActions)
  .index<ActionDto>()
  .pagination()
  .filter<Filter<IndexMyActionsQueryParams>>()
  .isLoading()
  .buildConnection();

export const useMyActions = connectionHook(myActionsConnection);

export const loadMyActions = connectionLoader(myActionsConnection);
