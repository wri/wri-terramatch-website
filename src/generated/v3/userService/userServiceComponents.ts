/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
import type * as Fetcher from "./userServiceFetcher";
import { userServiceFetch } from "./userServiceFetcher";
import type * as Schemas from "./userServiceSchemas";

export type AuthLoginError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: {
    /**
     * @example 401
     */
    statusCode: number;
    /**
     * @example Unauthorized
     */
    message: string;
    /**
     * @example Unauthorized
     */
    error?: string;
  };
}>;

export type AuthLoginResponse = {
  data?: {
    /**
     * @example logins
     */
    type?: string;
    /**
     * @pattern ^\d{5}$
     */
    id?: string;
    attributes?: Schemas.LoginDto;
  };
};

export type AuthLoginVariables = {
  body: Schemas.LoginRequest;
};

/**
 * Receive a JWT Token in exchange for login credentials
 */
export const authLogin = (variables: AuthLoginVariables, signal?: AbortSignal) =>
  userServiceFetch<AuthLoginResponse, AuthLoginError, Schemas.LoginRequest, {}, {}, {}>({
    url: "/auth/v3/logins",
    method: "post",
    ...variables,
    signal
  });

export type UsersFindPathParams = {
  /**
   * A valid user uuid or "me"
   *
   * @example me
   */
  uuid: string;
};

export type UsersFindError = Fetcher.ErrorWrapper<
  | {
      status: 401;
      payload: {
        /**
         * @example 401
         */
        statusCode: number;
        /**
         * @example Unauthorized
         */
        message: string;
        /**
         * @example Unauthorized
         */
        error?: string;
      };
    }
  | {
      status: 404;
      payload: {
        /**
         * @example 404
         */
        statusCode: number;
        /**
         * @example Not Found
         */
        message: string;
        /**
         * @example Not Found
         */
        error?: string;
      };
    }
>;

export type UsersFindResponse = {
  data?: {
    /**
     * @example users
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.UserDto;
    relationships?: {
      org?: {
        /**
         * @example organisations
         */
        type?: string;
        /**
         * @format uuid
         */
        id?: string;
        meta?: {
          userStatus?: "approved" | "requested" | "rejected" | "na";
        };
      };
    };
  };
  included?: {
    /**
     * @example organisations
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.OrganisationDto;
  }[];
};

export type UsersFindVariables = {
  pathParams: UsersFindPathParams;
};

/**
 * Fetch a user by ID, or with the 'me' identifier
 */
export const usersFind = (variables: UsersFindVariables, signal?: AbortSignal) =>
  userServiceFetch<UsersFindResponse, UsersFindError, undefined, {}, {}, UsersFindPathParams>({
    url: "/users/v3/users/{uuid}",
    method: "get",
    ...variables,
    signal
  });

export type UserUpdatePathParams = {
  /**
   * A valid user uuid
   */
  uuid: string;
};

export type UserUpdateError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: {
        /**
         * @example 400
         */
        statusCode: number;
        /**
         * @example Bad Request
         */
        message: string;
        /**
         * @example Bad Request
         */
        error?: string;
      };
    }
  | {
      status: 401;
      payload: {
        /**
         * @example 401
         */
        statusCode: number;
        /**
         * @example Unauthorized
         */
        message: string;
        /**
         * @example Unauthorized
         */
        error?: string;
      };
    }
  | {
      status: 404;
      payload: {
        /**
         * @example 404
         */
        statusCode: number;
        /**
         * @example Not Found
         */
        message: string;
        /**
         * @example Not Found
         */
        error?: string;
      };
    }
>;

export type UserUpdateResponse = {
  data?: {
    /**
     * @example users
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.UserDto;
    relationships?: {
      org?: {
        /**
         * @example organisations
         */
        type?: string;
        /**
         * @format uuid
         */
        id?: string;
        meta?: {
          userStatus?: "approved" | "requested" | "rejected" | "na";
        };
      };
    };
  };
  included?: {
    /**
     * @example organisations
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.OrganisationDto;
  }[];
};

export type UserUpdateVariables = {
  body: Schemas.UserUpdateBodyDto;
  pathParams: UserUpdatePathParams;
};

/**
 * Update a user by ID
 */
export const userUpdate = (variables: UserUpdateVariables, signal?: AbortSignal) =>
  userServiceFetch<UserUpdateResponse, UserUpdateError, Schemas.UserUpdateBodyDto, {}, {}, UserUpdatePathParams>({
    url: "/users/v3/users/{uuid}",
    method: "patch",
    ...variables,
    signal
  });

export type RequestPasswordResetError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: {
    /**
     * @example 400
     */
    statusCode: number;
    /**
     * @example Bad Request
     */
    message: string;
    /**
     * @example Bad Request
     */
    error?: string;
  };
}>;

export type RequestPasswordResetResponse = {
  data?: {
    /**
     * @example passwordResets
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.ResetPasswordResponseDto;
  };
};

export type RequestPasswordResetVariables = {
  body: Schemas.ResetPasswordRequest;
};

/**
 * Send password reset email with a token
 */
export const requestPasswordReset = (variables: RequestPasswordResetVariables, signal?: AbortSignal) =>
  userServiceFetch<RequestPasswordResetResponse, RequestPasswordResetError, Schemas.ResetPasswordRequest, {}, {}, {}>({
    url: "/auth/v3/passwordResets",
    method: "post",
    ...variables,
    signal
  });

export type ResetPasswordPathParams = {
  token: string;
};

export type ResetPasswordError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: {
    /**
     * @example 400
     */
    statusCode: number;
    /**
     * @example Bad Request
     */
    message: string;
    /**
     * @example Bad Request
     */
    error?: string;
  };
}>;

export type ResetPasswordResponse = {
  data?: {
    /**
     * @example passwordResets
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.ResetPasswordResponseDto;
  };
};

export type ResetPasswordVariables = {
  body?: Schemas.ResetPasswordDto;
  pathParams: ResetPasswordPathParams;
};

/**
 * Reset password using the provided token
 */
export const resetPassword = (variables: ResetPasswordVariables, signal?: AbortSignal) =>
  userServiceFetch<
    ResetPasswordResponse,
    ResetPasswordError,
    Schemas.ResetPasswordDto,
    {},
    {},
    ResetPasswordPathParams
  >({ url: "/auth/v3/passwordResets/{token}", method: "put", ...variables, signal });
