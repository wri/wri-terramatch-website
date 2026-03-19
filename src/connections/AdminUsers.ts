import { connectionHook } from "@/connections/util/connectionShortcuts";
import { userVerify, UserVerifyPathParams, UserVerifyResponse } from "@/generated/v3/userService/userServiceComponents";

import { v3Resource } from "./util/apiConnectionFactory";

const userVerifyConnection = v3Resource("verifications", userVerify)
  .create<UserVerifyResponse, UserVerifyPathParams>(({ uuid }) => ({ pathParams: { uuid } }))
  .buildConnection();

export const useAdminUserVerify = connectionHook(userVerifyConnection);
