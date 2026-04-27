import { StoreResourceMap } from "@/store/apiSlice";
import {
  LoginDto,
  ResetPasswordResponseDto,
  VerificationUserResponseDto,
  ResendVerificationResponseDto,
  OrganisationLightDto,
  OrganisationFullDto,
  UserDto,
  FileDownloadDto,
  DelayedJobDto,
  FinancialIndicatorDto,
  FinancialReportLightDto,
  MediaDto,
  FundingTypeDto,
  LeadershipDto,
  OwnershipStakeDto,
  TreeSpeciesDto,
  ActionDto,
  SendLoginDetailsResponseDto,
  UserAssociationDto,
  OrganisationInviteDto,
  ProjectInviteAcceptanceDto
} from "./userServiceSchemas";

export const USER_SERVICE_RESOURCES = [
  "logins",
  "passwordResets",
  "verifications",
  "resendVerifications",
  "organisations",
  "users",
  "fileDownloads",
  "delayedJobs",
  "financialIndicators",
  "financialReports",
  "media",
  "fundingTypes",
  "leaderships",
  "ownershipStakes",
  "treeSpecies",
  "actions",
  "sendLoginDetails",
  "associatedUsers",
  "organisationInvites",
  "projectInviteAcceptances"
] as const;

export type UserServiceApiResources = {
  logins: StoreResourceMap<LoginDto>;
  passwordResets: StoreResourceMap<ResetPasswordResponseDto>;
  verifications: StoreResourceMap<VerificationUserResponseDto>;
  resendVerifications: StoreResourceMap<ResendVerificationResponseDto>;
  organisations: StoreResourceMap<OrganisationLightDto | OrganisationFullDto>;
  users: StoreResourceMap<UserDto>;
  fileDownloads: StoreResourceMap<FileDownloadDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  financialIndicators: StoreResourceMap<FinancialIndicatorDto>;
  financialReports: StoreResourceMap<FinancialReportLightDto>;
  media: StoreResourceMap<MediaDto>;
  fundingTypes: StoreResourceMap<FundingTypeDto>;
  leaderships: StoreResourceMap<LeadershipDto>;
  ownershipStakes: StoreResourceMap<OwnershipStakeDto>;
  treeSpecies: StoreResourceMap<TreeSpeciesDto>;
  actions: StoreResourceMap<ActionDto>;
  sendLoginDetails: StoreResourceMap<SendLoginDetailsResponseDto>;
  associatedUsers: StoreResourceMap<UserAssociationDto>;
  organisationInvites: StoreResourceMap<OrganisationInviteDto>;
  projectInviteAcceptances: StoreResourceMap<ProjectInviteAcceptanceDto>;
};
