import { StoreResourceMap } from "@/store/apiSlice";
import {
  LoginDto,
  ResetPasswordResponseDto,
  VerificationUserResponseDto,
  OrganisationLightDto,
  OrganisationFullDto,
  UserDto,
  FinancialIndicatorDto,
  FinancialReportLightDto,
  MediaDto,
  FundingTypeDto,
  LeadershipDto,
  ActionDto
} from "./userServiceSchemas";

export const USER_SERVICE_RESOURCES = [
  "logins",
  "passwordResets",
  "verifications",
  "organisations",
  "users",
  "financialIndicators",
  "financialReports",
  "media",
  "fundingTypes",
  "leaderships",
  "actions"
] as const;

export type UserServiceApiResources = {
  logins: StoreResourceMap<LoginDto>;
  passwordResets: StoreResourceMap<ResetPasswordResponseDto>;
  verifications: StoreResourceMap<VerificationUserResponseDto>;
  organisations: StoreResourceMap<OrganisationLightDto | OrganisationFullDto>;
  users: StoreResourceMap<UserDto>;
  financialIndicators: StoreResourceMap<FinancialIndicatorDto>;
  financialReports: StoreResourceMap<FinancialReportLightDto>;
  media: StoreResourceMap<MediaDto>;
  fundingTypes: StoreResourceMap<FundingTypeDto>;
  leaderships: StoreResourceMap<LeadershipDto>;
  actions: StoreResourceMap<ActionDto>;
};
