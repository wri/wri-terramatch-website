import { verifyUser, VerifyUserResponse } from "@/generated/v3/userService/userServiceComponents";
import { VerificationUserBody } from "@/generated/v3/userService/userServiceSchemas";

import { v3Resource } from "./util/apiConnectionFactory";
import { resourceCreator } from "./util/resourceMutator";

const verificationUserConnection = v3Resource("verifications", verifyUser)
  .create<VerifyUserResponse, VerificationUserBody>()
  .buildConnection();

export const userVerification = resourceCreator(verificationUserConnection);
