import { StoreResourceMap } from "@/store/apiSlice";
import {
  LoginDto,
  UserDto,
  OrganisationDto,
  ResetPasswordResponseDto,
  VerificationUserResponseDto
} from "./userServiceSchemas";

export const USER_SERVICE_RESOURCES = ["logins", "users", "organisations", "passwordResets", "verifications"] as const;

export type UserServiceApiResources = {
  logins: StoreResourceMap<LoginDto>;
  users: StoreResourceMap<UserDto>;
  organisations: StoreResourceMap<OrganisationDto>;
  passwordResets: StoreResourceMap<ResetPasswordResponseDto>;
  verifications: StoreResourceMap<VerificationUserResponseDto>;
};
