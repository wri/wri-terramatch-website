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
  firstName: string;
  lastName: string;
  /**
   * Currently just calculated by appending lastName to firstName.
   */
  fullName: string;
  primaryRole: string;
  /**
   * @example person@foocorp.net
   */
  emailAddress: string;
  /**
   * @format date-time
   */
  emailAddressVerifiedAt: string;
  locale: string;
  frameworks: UserFramework[];
};

export type OrganisationDto = {
  status: "draft" | "pending" | "approved" | "rejected";
  name: string;
};