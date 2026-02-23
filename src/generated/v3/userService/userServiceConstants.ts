import { StoreResourceMap } from "@/store/apiSlice";
import {
  LoginDto,
  ResetPasswordResponseDto,
  VerificationUserResponseDto,
  OrganisationDto,
  UserDto,
  ActionDto,
  UserAssociationDto
} from "./userServiceSchemas";

export const USER_SERVICE_RESOURCES = [
  "logins",
  "passwordResets",
  "verifications",
  "organisations",
  "users",
  "actions",
  "associatedUsers"
] as const;

export type UserServiceApiResources = {
  logins: StoreResourceMap<LoginDto>;
  passwordResets: StoreResourceMap<ResetPasswordResponseDto>;
  verifications: StoreResourceMap<VerificationUserResponseDto>;
  organisations: StoreResourceMap<OrganisationDto>;
  users: StoreResourceMap<UserDto>;
  actions: StoreResourceMap<ActionDto>;
  associatedUsers: StoreResourceMap<UserAssociationDto>;
};
