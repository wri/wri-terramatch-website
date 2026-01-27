import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { actionsIndex } from "@/generated/v3/userService/userServiceComponents";
import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";

const actionsConnection = v3Resource("actions", actionsIndex).index<ActionDto>().isLoading().buildConnection();

export const useActions = connectionHook(actionsConnection);

export const loadActions = connectionLoader(actionsConnection);
