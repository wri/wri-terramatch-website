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
    define(['../ApiClient', '../model/FilterSearch', '../model/PitchByContinentReadAll', '../model/PitchComplete', '../model/PitchCreate', '../model/PitchRead', '../model/PitchReadAll', '../model/PitchUpdate', '../model/PitchVersionRead', '../model/PitchVersionReadAll', '../model/PitchVisibility'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/FilterSearch'), require('../model/PitchByContinentReadAll'), require('../model/PitchComplete'), require('../model/PitchCreate'), require('../model/PitchRead'), require('../model/PitchReadAll'), require('../model/PitchUpdate'), require('../model/PitchVersionRead'), require('../model/PitchVersionReadAll'), require('../model/PitchVisibility'));
  } else {
    // Browser globals (root is window)
    if (!root.WriRestorationMarketplaceApi) {
      root.WriRestorationMarketplaceApi = {};
    }
    root.WriRestorationMarketplaceApi.PitchesApi = factory(root.WriRestorationMarketplaceApi.ApiClient, root.WriRestorationMarketplaceApi.FilterSearch, root.WriRestorationMarketplaceApi.PitchByContinentReadAll, root.WriRestorationMarketplaceApi.PitchComplete, root.WriRestorationMarketplaceApi.PitchCreate, root.WriRestorationMarketplaceApi.PitchRead, root.WriRestorationMarketplaceApi.PitchReadAll, root.WriRestorationMarketplaceApi.PitchUpdate, root.WriRestorationMarketplaceApi.PitchVersionRead, root.WriRestorationMarketplaceApi.PitchVersionReadAll, root.WriRestorationMarketplaceApi.PitchVisibility);
  }
}(this, function(ApiClient, FilterSearch, PitchByContinentReadAll, PitchComplete, PitchCreate, PitchRead, PitchReadAll, PitchUpdate, PitchVersionRead, PitchVersionReadAll, PitchVisibility) {
  'use strict';

  /**
   * Pitches service.
   * @module api/PitchesApi
   * @version 1.0.0
   */

  /**
   * Constructs a new PitchesApi. 
   * @alias module:api/PitchesApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the continentsCONTINENTPitchesGet operation.
     * @callback module:api/PitchesApi~continentsCONTINENTPitchesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read all approved pitches by continent
     * @param {String} CONTINENT 
     * @param {module:api/PitchesApi~continentsCONTINENTPitchesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchReadAll}
     */
    this.continentsCONTINENTPitchesGet = function(CONTINENT, callback) {
      var postBody = null;

      // verify the required parameter 'CONTINENT' is set
      if (CONTINENT === undefined || CONTINENT === null) {
        throw new Error("Missing the required parameter 'CONTINENT' when calling continentsCONTINENTPitchesGet");
      }


      var pathParams = {
        'CONTINENT': CONTINENT
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
      var returnType = PitchReadAll;

      return this.apiClient.callApi(
        '/continents/{CONTINENT}/pitches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the continentsPitchesGet operation.
     * @callback module:api/PitchesApi~continentsPitchesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchByContinentReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Count all approved pitches by continent
     * @param {module:api/PitchesApi~continentsPitchesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchByContinentReadAll}
     */
    this.continentsPitchesGet = function(callback) {
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
      var returnType = PitchByContinentReadAll;

      return this.apiClient.callApi(
        '/continents/pitches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the organisationsIDPitchesGet operation.
     * @callback module:api/PitchesApi~organisationsIDPitchesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read an organisation's pitches
     * @param {Number} ID 
     * @param {module:api/PitchesApi~organisationsIDPitchesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchReadAll}
     */
    this.organisationsIDPitchesGet = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling organisationsIDPitchesGet");
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
      var returnType = PitchReadAll;

      return this.apiClient.callApi(
        '/organisations/{ID}/pitches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the organisationsIDPitchesInspectGet operation.
     * @callback module:api/PitchesApi~organisationsIDPitchesInspectGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchVersionReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Inspect an organisation's pitches
     * @param {Number} ID 
     * @param {module:api/PitchesApi~organisationsIDPitchesInspectGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchVersionReadAll}
     */
    this.organisationsIDPitchesInspectGet = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling organisationsIDPitchesInspectGet");
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
      var returnType = PitchVersionReadAll;

      return this.apiClient.callApi(
        '/organisations/{ID}/pitches/inspect', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchesIDCompletePatch operation.
     * @callback module:api/PitchesApi~pitchesIDCompletePatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Mark a pitch as complete
     * @param {Number} ID 
     * @param {module:model/PitchComplete} body 
     * @param {module:api/PitchesApi~pitchesIDCompletePatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchRead}
     */
    this.pitchesIDCompletePatch = function(ID, body, callback) {
      var postBody = body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchesIDCompletePatch");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling pitchesIDCompletePatch");
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
      var returnType = PitchRead;

      return this.apiClient.callApi(
        '/pitches/{ID}/complete', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchesIDGet operation.
     * @callback module:api/PitchesApi~pitchesIDGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read a pitch
     * @param {Number} ID 
     * @param {module:api/PitchesApi~pitchesIDGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchRead}
     */
    this.pitchesIDGet = function(ID, callback) {
      var postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchesIDGet");
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
      var returnType = PitchRead;

      return this.apiClient.callApi(
        '/pitches/{ID}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchesIDPatch operation.
     * @callback module:api/PitchesApi~pitchesIDPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchVersionRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a pitch
     * @param {Number} ID 
     * @param {module:model/PitchUpdate} body 
     * @param {module:api/PitchesApi~pitchesIDPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchVersionRead}
     */
    this.pitchesIDPatch = function(ID, body, callback) {
      var postBody = body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchesIDPatch");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling pitchesIDPatch");
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
      var returnType = PitchVersionRead;

      return this.apiClient.callApi(
        '/pitches/{ID}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchesIDVisibilityPatch operation.
     * @callback module:api/PitchesApi~pitchesIDVisibilityPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a pitch's visibility
     * @param {Number} ID 
     * @param {module:model/PitchVisibility} body 
     * @param {module:api/PitchesApi~pitchesIDVisibilityPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchRead}
     */
    this.pitchesIDVisibilityPatch = function(ID, body, callback) {
      var postBody = body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling pitchesIDVisibilityPatch");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling pitchesIDVisibilityPatch");
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
      var returnType = PitchRead;

      return this.apiClient.callApi(
        '/pitches/{ID}/visibility', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchesMostRecentGet operation.
     * @callback module:api/PitchesApi~pitchesMostRecentGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Read all approved pitches by created date
     * @param {Object} opts Optional parameters
     * @param {Number} opts.limit 
     * @param {module:api/PitchesApi~pitchesMostRecentGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchReadAll}
     */
    this.pitchesMostRecentGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'limit': opts['limit'],
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
      var returnType = PitchReadAll;

      return this.apiClient.callApi(
        '/pitches/most_recent', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchesPost operation.
     * @callback module:api/PitchesApi~pitchesPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchVersionRead} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a pitch
     * @param {module:model/PitchCreate} body 
     * @param {module:api/PitchesApi~pitchesPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchVersionRead}
     */
    this.pitchesPost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling pitchesPost");
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
      var returnType = PitchVersionRead;

      return this.apiClient.callApi(
        '/pitches', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the pitchesSearchPost operation.
     * @callback module:api/PitchesApi~pitchesSearchPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PitchReadAll} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search all pitches
     * @param {module:model/FilterSearch} body 
     * @param {module:api/PitchesApi~pitchesSearchPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PitchReadAll}
     */
    this.pitchesSearchPost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling pitchesSearchPost");
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
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = PitchReadAll;

      return this.apiClient.callApi(
        '/pitches/search', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
