import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import { authLogin } from "@/generated/v3/userService/userServiceComponents";
import { LoginDto } from "@/generated/v3/userService/userServiceSchemas";

import { v3Resource } from "./util/apiConnectionFactory";

export const loginConnection = v3Resource("logins", authLogin).create<LoginDto>().buildConnection();

export const useLogin = connectionHook(loginConnection);
export const selectLogin = connectionSelector(loginConnection);
