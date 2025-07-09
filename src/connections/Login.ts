import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import { authLogin } from "@/generated/v3/userService/userServiceComponents";
import { LoginDto } from "@/generated/v3/userService/userServiceSchemas";

import { v3Endpoint } from "./util/apiConnectionFactory";

export const loginConnection = v3Endpoint("logins", authLogin).create<LoginDto>().buildConnection();

export const useLogin = connectionHook(loginConnection);
export const selectLogin = connectionSelector(loginConnection);
