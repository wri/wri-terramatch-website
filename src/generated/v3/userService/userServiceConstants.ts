import { StoreResourceMap } from "@/store/apiSlice";
import {
  LoginDto,
  ResetPasswordResponseDto,
  VerificationUserResponseDto,
  OrganisationLightDto,
  OrganisationFullDto,
  FinancialIndicatorDto,
  ActionDto,
  UserDto
} from "./userServiceSchemas";

export const USER_SERVICE_RESOURCES = [
  "logins",
  "passwordResets",
  "verifications",
  "organisations",
  "financialIndicators",
  "actions",
  "users"
] as const;

export type UserServiceApiResources = {
  logins: StoreResourceMap<LoginDto>;
  passwordResets: StoreResourceMap<ResetPasswordResponseDto>;
  verifications: StoreResourceMap<VerificationUserResponseDto>;
  organisations: StoreResourceMap<OrganisationLightDto | OrganisationFullDto>;
  financialIndicators: StoreResourceMap<FinancialIndicatorDto>;
  actions: StoreResourceMap<ActionDto>;
  users: StoreResourceMap<UserDto>;
};
