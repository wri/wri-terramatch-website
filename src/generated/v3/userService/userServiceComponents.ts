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
  };
}>;

export type AuthLoginResponse = {
  meta?: {
    /**
     * @example logins
     */
    resourceType?: string;
  };
  data?: {
    /**
     * @example logins
     */
    type?: string;
    /**
     * @format uuid
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
   * A valid user UUID or "me"
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
      };
    }
>;

export type UsersFindResponse = {
  meta?: {
    /**
     * @example users
     */
    resourceType?: string;
  };
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
 * Fetch a user by UUID, or with the 'me' identifier
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
      };
    }
>;

export type UserUpdateResponse = {
  meta?: {
    /**
     * @example users
     */
    resourceType?: string;
  };
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
  body: Schemas.UserUpdateBody;
  pathParams: UserUpdatePathParams;
};

/**
 * Update a user by UUID
 */
export const userUpdate = (variables: UserUpdateVariables, signal?: AbortSignal) =>
  userServiceFetch<UserUpdateResponse, UserUpdateError, Schemas.UserUpdateBody, {}, {}, UserUpdatePathParams>({
    url: "/users/v3/users/{uuid}",
    method: "patch",
    ...variables,
    signal
  });

export type UserCreationError = Fetcher.ErrorWrapper<{
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
  };
}>;

export type UserCreationResponse = {
  meta?: {
    /**
     * @example users
     */
    resourceType?: string;
  };
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

export type UserCreationVariables = {
  body: Schemas.UserNewRequest;
};

/**
 * Create a new user
 */
export const userCreation = (variables: UserCreationVariables, signal?: AbortSignal) =>
  userServiceFetch<UserCreationResponse, UserCreationError, Schemas.UserNewRequest, {}, {}, {}>({
    url: "/users/v3/users",
    method: "post",
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
  };
}>;

export type RequestPasswordResetResponse = {
  meta?: {
    /**
     * @example passwordResets
     */
    resourceType?: string;
  };
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
  };
}>;

export type ResetPasswordResponse = {
  meta?: {
    /**
     * @example passwordResets
     */
    resourceType?: string;
  };
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

export type VerifyUserError = Fetcher.ErrorWrapper<{
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
  };
}>;

export type VerifyUserResponse = {
  meta?: {
    /**
     * @example verifications
     */
    resourceType?: string;
  };
  data?: {
    /**
     * @example verifications
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.VerificationUserResponseDto;
  };
};

export type VerifyUserVariables = {
  body: Schemas.VerificationUserRequest;
};

/**
 * Receive a token to verify a user and return the verification status
 */
export const verifyUser = (variables: VerifyUserVariables, signal?: AbortSignal) =>
  userServiceFetch<VerifyUserResponse, VerifyUserError, Schemas.VerificationUserRequest, {}, {}, {}>({
    url: "/auth/v3/verifications",
    method: "post",
    ...variables,
    signal
  });

export const operationsByTag = {
  login: { authLogin },
  users: { usersFind, userUpdate, userCreation },
  resetPassword: { requestPasswordReset, resetPassword },
  verificationUser: { verifyUser }
};
