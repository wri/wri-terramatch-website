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
    define(['../ApiClient', '../model/Empty', '../model/PitchDocumentVersionRead', '../model/PitchDocumentVersionReadAll', '../model/PitchDocumentVersionReject'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Empty'), require('../model/PitchDocumentVersionRead'), require('../model/PitchDocumentVersionReadAll'), require('../model/PitchDocumentVersionReject'));
  } else {
    // Browser globals (root is window)
    if (!root.WriRestorationMarketplaceApi) {
      root.WriRestorationMarketplaceApi = {};
    }
    root.WriRestorationMarketplaceApi.PitchDocumentVersionsApi = factory(root.WriRestorationMarketplaceApi.ApiClient, root.WriRestorationMarketplaceApi.Empty, root.WriRestorationMarketplaceApi.PitchDocumentVersionRead, root.WriRestorationMarketplaceApi.PitchDocumentVersionReadAll, root.WriRestorationMarketplaceApi.PitchDocumentVersionReject);
  }
}(this, function(ApiClient, Empty, PitchDocumentVersionRead, PitchDocumentVersionReadAll, PitchDocumentVersionReject) {
  'use strict';

  /**
   * PitchDocumentVersions service.
   * @module api/PitchDocumentVersionsApi
   * @version 1.0.0
   */

  /**
   * Constructs a new PitchDocumentVersionsApi. 
   * @alias module:api/PitchDocumentVersionsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the pitchDocumentVersionsIDApprovePatch operation.
     * @callback module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDApprovePatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchDocumentVersionRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Approve a pitch document version
     * @param {Number} ID 
     * @param {module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDApprovePatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchDocumentVersionRead}
     */
    this.pitchDocumentVersionsIDApprovePatch = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchDocumentVersionsIDApprovePatch");
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
      var returnType = PitchDocumentVersionRead;

      return this.apiClient.callApi(
        '/pitch_document_versions/{ID}/approve', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchDocumentVersionsIDDelete operation.
     * @callback module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDDeleteCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Empty} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a pitch document version
     * @param {Number} ID 
     * @param {module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDDeleteCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Empty}
     */
    this.pitchDocumentVersionsIDDelete = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchDocumentVersionsIDDelete");
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
        '/pitch_document_versions/{ID}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchDocumentVersionsIDGet operation.
     * @callback module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchDocumentVersionRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read a pitch document version
     * @param {Number} ID 
     * @param {module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchDocumentVersionRead}
     */
    this.pitchDocumentVersionsIDGet = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchDocumentVersionsIDGet");
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
      var returnType = PitchDocumentVersionRead;

      return this.apiClient.callApi(
        '/pitch_document_versions/{ID}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchDocumentVersionsIDRejectPatch operation.
     * @callback module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDRejectPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchDocumentVersionRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reject a pitch document version
     * @param {Number} ID 
     * @param {module:model/PitchDocumentVersionReject} body 
     * @param {module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDRejectPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchDocumentVersionRead}
     */
    this.pitchDocumentVersionsIDRejectPatch = function(ID, body, callback) {
      var postBody = body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchDocumentVersionsIDRejectPatch");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling pitchDocumentVersionsIDRejectPatch");
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
      var returnType = PitchDocumentVersionRead;

      return this.apiClient.callApi(
        '/pitch_document_versions/{ID}/reject', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchDocumentVersionsIDRevivePatch operation.
     * @callback module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDRevivePatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchDocumentVersionRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Revive a pitch document version
     * @param {Number} ID 
     * @param {module:api/PitchDocumentVersionsApi~pitchDocumentVersionsIDRevivePatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchDocumentVersionRead}
     */
    this.pitchDocumentVersionsIDRevivePatch = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchDocumentVersionsIDRevivePatch");
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
      var returnType = PitchDocumentVersionRead;

      return this.apiClient.callApi(
        '/pitch_document_versions/{ID}/revive', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchDocumentsIDPitchDocumentVersionsGet operation.
     * @callback module:api/PitchDocumentVersionsApi~pitchDocumentsIDPitchDocumentVersionsGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchDocumentVersionReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read a pitch document's pitch document versions
     * @param {Number} ID 
     * @param {module:api/PitchDocumentVersionsApi~pitchDocumentsIDPitchDocumentVersionsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchDocumentVersionReadAll}
     */
    this.pitchDocumentsIDPitchDocumentVersionsGet = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchDocumentsIDPitchDocumentVersionsGet");
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
      var returnType = PitchDocumentVersionReadAll;

      return this.apiClient.callApi(
        '/pitch_documents/{ID}/pitch_document_versions', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
