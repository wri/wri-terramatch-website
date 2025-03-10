/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type LoginDto = {
  /**
   * JWT token for use in future authenticated requests to the API.
   *
   * @example <jwt token>
   */
  token: string;
};

export type LoginRequest = {
  emailAddress: string;
  password: string;
};

export type UserFramework = {
  /**
   * @example TerraFund Landscapes
   */
  name: string;
  /**
   * @example terrafund-landscapes
   */
  slug: string;
};

export type UserDto = {
  uuid: string;
  firstName: string | null;
  lastName: string | null;
  /**
   * Currently just calculated by appending lastName to firstName.
   */
  fullName: string | null;
  primaryRole: string;
  /**
   * @example person@foocorp.net
   */
  emailAddress: string;
  /**
   * @format date-time
   */
  emailAddressVerifiedAt: string | null;
  locale: string | null;
  frameworks: UserFramework[];
};

export type OrganisationDto = {
  status: "draft" | "pending" | "approved" | "rejected";
  name: string | null;
};

export type UserUpdateAttributes = {
  /**
   * New default locale for the given user
   */
  locale: "en-US" | "es-MX" | "fr-FR" | "pt-BR" | null;
};

export type UserUpdate = {
  type: "users";
  /**
   * @format uuid
   */
  id: string;
  attributes: UserUpdateAttributes;
};

export type UserUpdateBodyDto = {
  data: UserUpdate;
};

export type ResetPasswordResponseDto = {
  /**
   * User email
   *
   * @example user@example.com
   */
  emailAddress: string;
};

export type ResetPasswordRequest = {
  emailAddress: string;
  callbackUrl: string;
};

export type ResetPasswordDto = {};

export type VerificationUserResponseDto = {
  verified: boolean;
};

export type VerificationUserRequest = {
  token: string;
};
