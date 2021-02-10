/*
 * WRI Restoration Marketplace API
 * ### About  This API serves the web and mobile apps for WRI's Restoration Marketplace (AKA TerraMatch).  ### Authentication & Authorisation  JWTs are used for authentication. Upon successful log in a JWT will be provided for you. These expire after 12 hours.  A padlock icon next to an endpoint indicates that it requires an authenticated user. For example:  ![](/images/padlock.png)  ### Requests & Responses  The response bodies documented here will be wrapped in an object adhering to the JSON:API specification.  ### Error Codes  Any errors returned in the body of a response will have a unique code to help identify the type of error. They are:  ``` ACCEPTED, ACTIVE_URL, AFTER, AFTER_OR_EQUAL, ALPHA, ALPHA_DASH, ALPHA_NUM, ARRAY, BEFORE, BEFORE_OR_EQUAL, BETWEEN, BOOLEAN, CARBON_CERTIFICATION_TYPE, CONFIRMED, CONTAIN_LOWER, CONTAIN_NUMBER, CONTAIN_UPPER, CONTINENT, COUNTRY_CODE, CUSTOM, DATE, DATE_EQUALS, DATE_FORMAT, DIFFERENT, DIGITS, DIGITS_BETWEEN, DIMENSIONS, DISTINCT, DOCUMENT_TYPE, EMAIL, ENDS_WITH, EXISTS, FILE, FILLED, FUNDING_BRACKET, FUNDING_SOURCE, GT, GTE, IMAGE, IN, IN_ARRAY, INTEGER, IP, IPV4, IPV6, JSON, LAND_OWNERSHIP, LAND_SIZE, LAND_TYPE, LT, LTE, MAX, MIMES, MIMETYPES, MIN, NOT_IN, NOT_PRESENT, NOT_REGEX, NUMERIC, OTHER_VALUE_PRESENT, OTHER_VALUE_NULL, OTHER_VALUE_STRING, ORGANISATION_CATEGORY, ORGANISATION_TYPE, PRESENT, REGEX, REJECTED_REASON, REPORTING_FREQUENCY, REPORTING_LEVEL, REQUIRED, REQUIRED_IF, REQUIRED_UNLESS, REQUIRED_WITH, REQUIRED_WITH_ALL, REQUIRED_WITHOUT, REQUIRED_WITHOUT_ALL, RESTORATION_GOAL, RESTORATION_METHOD, REVENUE_DRIVER, SAME, SIZE, SOFT_URL, STARTS_WITH, STARTS_WITH_FACEBOOK, STARTS_WITH_TWITTER, STARTS_WITH_INSTAGRAM, STARTS_WITH_LINKEDIN, STRICT_FLOAT, STRING, SUSTAINABLE_DEVELOPMENT_GOAL, TIMEZONE, TREE_SPECIES_OWNER, UNIQUE, UPLOADED, URL, UUID, VISIBILITY ```  ### Uploads  Uploads should first be uploaded to the `/uploads` endpoint. Upon success an ID will be returned, this ID is valid for 1 day. Use this ID in your request body to bind the upload to a property.  ### Elevator Videos  Elevator videos can be created by using the `/elevator_videos` endpoint. After creating an elevator video you will be returned an elevator video ID. Use this to check its status. Elevator videos will start off as `processing` and change to `finished` when it has been build. Once the elevator video is built the `upload_id` property will be present, you can use this just like a regular upload and attach it to a pitch's `video` property. Be sure to use the elevator video's `upload_id` property and not its `id` property. An elevator video's status may end up as `errored` or `timed_out` in which case something has gone wrong.  ### Entity Relationship Diagram  ![](/images/erd.png)  ### Units  * All prices are measured in USD * All land is measured in hectares * All time is measured in months  ### Drafts  When creating a draft the `data` property be equal to a string of JSON containing an empty object. You can then manipulate the `data` property with subsequent updates. When updating a draft you will need to use [JSON Patch](http://jsonpatch.com/) requests to manipulate the `data` property. Operations are relative to the `data` property which means you don't need to preface paths with `/data`. 
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.11-SNAPSHOT
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['../ApiClient', '../model/AuthChange', '../model/AuthLogIn', '../model/AuthReset', '../model/AuthVerify', '../model/Empty', '../model/TokenRead', '../model/UserRead'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/AuthChange'), require('../model/AuthLogIn'), require('../model/AuthReset'), require('../model/AuthVerify'), require('../model/Empty'), require('../model/TokenRead'), require('../model/UserRead'));
  } else {
    // Browser globals (root is window)
    if (!root.WriRestorationMarketplaceApi) {
      root.WriRestorationMarketplaceApi = {};
    }
    root.WriRestorationMarketplaceApi.AuthApi = factory(root.WriRestorationMarketplaceApi.ApiClient, root.WriRestorationMarketplaceApi.AuthChange, root.WriRestorationMarketplaceApi.AuthLogIn, root.WriRestorationMarketplaceApi.AuthReset, root.WriRestorationMarketplaceApi.AuthVerify, root.WriRestorationMarketplaceApi.Empty, root.WriRestorationMarketplaceApi.TokenRead, root.WriRestorationMarketplaceApi.UserRead);
  }
}(this, function(ApiClient, AuthChange, AuthLogIn, AuthReset, AuthVerify, Empty, TokenRead, UserRead) {
  'use strict';

  /**
   * Auth service.
   * @module api/AuthApi
   * @version 1.0.0
   */

  /**
   * Constructs a new AuthApi. 
   * @alias module:api/AuthApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the authChangePatch operation.
     * @callback module:api/AuthApi~authChangePatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Empty} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reset a user's or admin's password
     * @param {module:model/AuthChange} body 
     * @param {module:api/AuthApi~authChangePatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Empty}
     */
    this.authChangePatch = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling authChangePatch");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Empty;

      return this.apiClient.callApi(
        '/auth/change', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authLoginPost operation.
     * @callback module:api/AuthApi~authLoginPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/TokenRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Log a user or admin in
     * @param {module:model/AuthLogIn} body 
     * @param {module:api/AuthApi~authLoginPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/TokenRead}
     */
    this.authLoginPost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling authLoginPost");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = TokenRead;

      return this.apiClient.callApi(
        '/auth/login', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authLogoutGet operation.
     * @callback module:api/AuthApi~authLogoutGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Empty} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Log the logged in user or admin out
     * @param {module:api/AuthApi~authLogoutGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Empty}
     */
    this.authLogoutGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['BearerAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Empty;

      return this.apiClient.callApi(
        '/auth/logout', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authMeGet operation.
     * @callback module:api/AuthApi~authMeGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read the logged in user or admin
     * @param {module:api/AuthApi~authMeGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserRead}
     */
    this.authMeGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['BearerAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = UserRead;

      return this.apiClient.callApi(
        '/auth/me', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authRefreshGet operation.
     * @callback module:api/AuthApi~authRefreshGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/TokenRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Refresh the logged in user's or admin's JWT token
     * @param {module:api/AuthApi~authRefreshGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/TokenRead}
     */
    this.authRefreshGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['BearerAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = TokenRead;

      return this.apiClient.callApi(
        '/auth/refresh', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authResendGet operation.
     * @callback module:api/AuthApi~authResendGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Empty} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Send a verification email to the logged in user or admin
     * @param {module:api/AuthApi~authResendGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Empty}
     */
    this.authResendGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['BearerAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Empty;

      return this.apiClient.callApi(
        '/auth/resend', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authResetPost operation.
     * @callback module:api/AuthApi~authResetPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Empty} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Send a password reset email to a user or admin
     * @param {module:model/AuthReset} body 
     * @param {module:api/AuthApi~authResetPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Empty}
     */
    this.authResetPost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling authResetPost");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Empty;

      return this.apiClient.callApi(
        '/auth/reset', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authVerifyPatch operation.
     * @callback module:api/AuthApi~authVerifyPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Empty} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Verify the logged in user's or admin's email address
     * @param {module:model/AuthVerify} body 
     * @param {module:api/AuthApi~authVerifyPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Empty}
     */
    this.authVerifyPatch = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling authVerifyPatch");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['BearerAuth'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Empty;

      return this.apiClient.callApi(
        '/auth/verify', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
