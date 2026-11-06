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

export const Roles = {
  ROLE_NAMES: {
    "admin-super": "Super Admin",
    "admin-ppc": "PPC Admin",
    "admin-terrafund": "TerraFund Admin",
    "admin-hbf": "HBF Admin",
    "admin-epa-ghana-pilot": "EPA Ghana Pilot Admin",
    "admin-fundo-flora": "Fundo Flora Admin",
    "admin-wcb": "WCB Admin",
    "admin-barka-fund": "Barka Fund Admin",
    "admin-polygon-monitoring": "Polygon Monitoring Admin",
    "project-developer": "Project Developer",
    "project-manager": "Project Manager",
    "greenhouse-service-account": "Greenhouse Service Account",
    "research-service-account": "Research Service Account",
    government: "Government",
    funder: "Funder"
  } as const,
  COMBINABLE_ROLES: [
    "admin-barka-fund",
    "admin-epa-ghana-pilot",
    "admin-fundo-flora",
    "admin-hbf",
    "admin-polygon-monitoring",
    "admin-ppc",
    "admin-terrafund",
    "admin-wcb"
  ] as const
} as const;

export const Frameworks = {
  FRAMEWORK_NAMES: {
    "barka-fund": "Barka Fund",
    "epa-ghana-pilot": "EPA-Ghana Pilot",
    "fundo-flora": "Fundo Flora",
    hbf: "Harit Bharat Fund",
    "polygon-monitoring": "Polygon Monitoring",
    ppc: "PPC",
    "terrafund-enterprises": "TerraFund Enterprises",
    "terrafund-non-profits": "TerraFund Non-Profits",
    wcb: "Wildlife Conservation Bond"
  } as const
} as const;
