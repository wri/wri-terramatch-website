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
    define(['../ApiClient', '../model/DraftCreate', '../model/DraftRead', '../model/DraftReadAll', '../model/DraftUpdate', '../model/Empty', '../model/InlineResponse201'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/DraftCreate'), require('../model/DraftRead'), require('../model/DraftReadAll'), require('../model/DraftUpdate'), require('../model/Empty'), require('../model/InlineResponse201'));
  } else {
    // Browser globals (root is window)
    if (!root.WriRestorationMarketplaceApi) {
      root.WriRestorationMarketplaceApi = {};
    }
    root.WriRestorationMarketplaceApi.DraftsApi = factory(root.WriRestorationMarketplaceApi.ApiClient, root.WriRestorationMarketplaceApi.DraftCreate, root.WriRestorationMarketplaceApi.DraftRead, root.WriRestorationMarketplaceApi.DraftReadAll, root.WriRestorationMarketplaceApi.DraftUpdate, root.WriRestorationMarketplaceApi.Empty, root.WriRestorationMarketplaceApi.InlineResponse201);
  }
}(this, function(ApiClient, DraftCreate, DraftRead, DraftReadAll, DraftUpdate, Empty, InlineResponse201) {
  'use strict';

  /**
   * Drafts service.
   * @module api/DraftsApi
   * @version 1.0.0
   */

  /**
   * Constructs a new DraftsApi. 
   * @alias module:api/DraftsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the draftsIDDelete operation.
     * @callback module:api/DraftsApi~draftsIDDeleteCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Empty} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a draft
     * @param {Number} ID 
     * @param {module:api/DraftsApi~draftsIDDeleteCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Empty}
     */
    this.draftsIDDelete = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling draftsIDDelete");
      }


      var pathParams = {
        'ID': ID
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
        '/drafts/{ID}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the draftsIDGet operation.
     * @callback module:api/DraftsApi~draftsIDGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DraftRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read a draft
     * @param {Number} ID 
     * @param {module:api/DraftsApi~draftsIDGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DraftRead}
     */
    this.draftsIDGet = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling draftsIDGet");
      }


      var pathParams = {
        'ID': ID
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
      var returnType = DraftRead;

      return this.apiClient.callApi(
        '/drafts/{ID}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the draftsIDPatch operation.
     * @callback module:api/DraftsApi~draftsIDPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DraftRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a draft
     * @param {Number} ID 
     * @param {module:model/DraftUpdate} body 
     * @param {module:api/DraftsApi~draftsIDPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DraftRead}
     */
    this.draftsIDPatch = function(ID, body, callback) {
      var postBody = body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling draftsIDPatch");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling draftsIDPatch");
      }


      var pathParams = {
        'ID': ID
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
      var returnType = DraftRead;

      return this.apiClient.callApi(
        '/drafts/{ID}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the draftsIDPublishPatch operation.
     * @callback module:api/DraftsApi~draftsIDPublishPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/InlineResponse201} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Publish a draft
     * @param {Number} ID 
     * @param {module:api/DraftsApi~draftsIDPublishPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/InlineResponse201}
     */
    this.draftsIDPublishPatch = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling draftsIDPublishPatch");
      }


      var pathParams = {
        'ID': ID
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
      var returnType = InlineResponse201;

      return this.apiClient.callApi(
        '/drafts/{ID}/publish', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the draftsOffersGet operation.
     * @callback module:api/DraftsApi~draftsOffersGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DraftReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read all drafts by type
     * @param {module:api/DraftsApi~draftsOffersGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DraftReadAll}
     */
    this.draftsOffersGet = function(callback) {
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
      var returnType = DraftReadAll;

      return this.apiClient.callApi(
        '/drafts/offers', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the draftsPitchesGet operation.
     * @callback module:api/DraftsApi~draftsPitchesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DraftReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read all drafts by type
     * @param {module:api/DraftsApi~draftsPitchesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DraftReadAll}
     */
    this.draftsPitchesGet = function(callback) {
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
      var returnType = DraftReadAll;

      return this.apiClient.callApi(
        '/drafts/pitches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the draftsPost operation.
     * @callback module:api/DraftsApi~draftsPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DraftRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a draft
     * @param {module:model/DraftCreate} body 
     * @param {module:api/DraftsApi~draftsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DraftRead}
     */
    this.draftsPost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling draftsPost");
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
      var returnType = DraftRead;

      return this.apiClient.callApi(
        '/drafts', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
