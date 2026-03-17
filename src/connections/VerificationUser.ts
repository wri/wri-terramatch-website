import {
  resendUserVerification,
  verifyUser,
  VerifyUserResponse
} from "@/generated/v3/userService/userServiceComponents";
import { ResendVerificationData, VerificationUserBody } from "@/generated/v3/userService/userServiceSchemas";

import { v3Resource } from "./util/apiConnectionFactory";
import { creationHook } from "./util/connectionShortcuts";
import { resourceCreator } from "./util/resourceMutator";

const verificationUserConnection = v3Resource("verifications", verifyUser)
  .create<VerifyUserResponse, VerificationUserBody>()
  .buildConnection();

const resendVerificationConnection = v3Resource("verifications", resendUserVerification)
  .create<ResendVerificationData>()
  .buildConnection();

export const useResendVerification = creationHook(resendVerificationConnection);

export const userVerification = resourceCreator(verificationUserConnection);
