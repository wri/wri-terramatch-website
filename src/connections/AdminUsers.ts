import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  sendLoginDetails,
  SendLoginDetailsResponse,
  userVerify,
  UserVerifyPathParams,
  UserVerifyResponse
} from "@/generated/v3/userService/userServiceComponents";

import { v3Resource } from "./util/apiConnectionFactory";

const userVerifyConnection = v3Resource("verifications", userVerify)
  .create<UserVerifyResponse, UserVerifyPathParams>(({ uuid }) => ({ pathParams: { uuid } }))
  .buildConnection();

export const sendLoginDetailsToUser = async (emailAddress: string): Promise<SendLoginDetailsResponse> => {
  return await sendLoginDetails.fetchParallel({
    body: {
      data: {
        type: "sendLoginDetails",
        attributes: { emailAddress }
      }
    }
  });
};

export const useAdminUserVerify = connectionHook(userVerifyConnection);
