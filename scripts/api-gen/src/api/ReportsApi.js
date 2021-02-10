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
    define(['../ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.WriRestorationMarketplaceApi) {
      root.WriRestorationMarketplaceApi = {};
    }
    root.WriRestorationMarketplaceApi.ReportsApi = factory(root.WriRestorationMarketplaceApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * Reports service.
   * @module api/ReportsApi
   * @version 1.0.0
   */

  /**
   * Constructs a new ReportsApi. 
   * @alias module:api/ReportsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the reportsApprovedOrganisationsGet operation.
     * @callback module:api/ReportsApi~reportsApprovedOrganisationsGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of approved organisations
     * @param {module:api/ReportsApi~reportsApprovedOrganisationsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsApprovedOrganisationsGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/approved_organisations', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsApprovedPitchesGet operation.
     * @callback module:api/ReportsApi~reportsApprovedPitchesGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of approved pitches
     * @param {module:api/ReportsApi~reportsApprovedPitchesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsApprovedPitchesGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/approved_pitches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsBenefitedPeopleGet operation.
     * @callback module:api/ReportsApi~reportsBenefitedPeopleGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of matched benefited people
     * @param {module:api/ReportsApi~reportsBenefitedPeopleGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsBenefitedPeopleGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/benefited_people', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsFilterRecordsGet operation.
     * @callback module:api/ReportsApi~reportsFilterRecordsGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of filters recorded
     * @param {module:api/ReportsApi~reportsFilterRecordsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsFilterRecordsGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/filter_records', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsFundingAmountsGet operation.
     * @callback module:api/ReportsApi~reportsFundingAmountsGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of matched funding amounts
     * @param {module:api/ReportsApi~reportsFundingAmountsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsFundingAmountsGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/funding_amounts', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsInterestsGet operation.
     * @callback module:api/ReportsApi~reportsInterestsGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of interests
     * @param {module:api/ReportsApi~reportsInterestsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsInterestsGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/interests', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsMatchesGet operation.
     * @callback module:api/ReportsApi~reportsMatchesGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of matches
     * @param {module:api/ReportsApi~reportsMatchesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsMatchesGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/matches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsOffersGet operation.
     * @callback module:api/ReportsApi~reportsOffersGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of offers
     * @param {module:api/ReportsApi~reportsOffersGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsOffersGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/offers', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsRejectedOrganisationsGet operation.
     * @callback module:api/ReportsApi~reportsRejectedOrganisationsGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of rejected organisations
     * @param {module:api/ReportsApi~reportsRejectedOrganisationsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsRejectedOrganisationsGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/rejected_organisations', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsRejectedPitchesGet operation.
     * @callback module:api/ReportsApi~reportsRejectedPitchesGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of rejected pitches
     * @param {module:api/ReportsApi~reportsRejectedPitchesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsRejectedPitchesGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/rejected_pitches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsRestoredHectaresGet operation.
     * @callback module:api/ReportsApi~reportsRestoredHectaresGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of matched restored hectares
     * @param {module:api/ReportsApi~reportsRestoredHectaresGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsRestoredHectaresGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/restored_hectares', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the reportsUsersGet operation.
     * @callback module:api/ReportsApi~reportsUsersGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Export CSV report of users
     * @param {module:api/ReportsApi~reportsUsersGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.reportsUsersGet = function(callback) {
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
      var accepts = ['text/plain'];
      var returnType = File;

      return this.apiClient.callApi(
        '/reports/users', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
