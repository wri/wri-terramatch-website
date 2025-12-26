import { StoreResourceMap } from "@/store/apiSlice";
import {
  LoginDto,
  ResetPasswordResponseDto,
  VerificationUserResponseDto,
  OrganisationDto,
  UserDto
} from "./userServiceSchemas";

export const USER_SERVICE_RESOURCES = ["logins", "passwordResets", "verifications", "organisations", "users"] as const;

export type UserServiceApiResources = {
  logins: StoreResourceMap<LoginDto>;
  passwordResets: StoreResourceMap<ResetPasswordResponseDto>;
  verifications: StoreResourceMap<VerificationUserResponseDto>;
  organisations: StoreResourceMap<OrganisationDto>;
  users: StoreResourceMap<UserDto>;
};
