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
    define(['../ApiClient', '../model/CarbonCertificationCreateDraft', '../model/PitchContactCreateDraft', '../model/PitchCreate', '../model/PitchDocumentCreateDraft', '../model/RestorationMethodMetricCreateDraft', '../model/TreeSpeciesCreateDraft'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CarbonCertificationCreateDraft'), require('./PitchContactCreateDraft'), require('./PitchCreate'), require('./PitchDocumentCreateDraft'), require('./RestorationMethodMetricCreateDraft'), require('./TreeSpeciesCreateDraft'));
  } else {
    // Browser globals (root is window)
    if (!root.WriRestorationMarketplaceApi) {
      root.WriRestorationMarketplaceApi = {};
    }
    root.WriRestorationMarketplaceApi.DraftDataPitchRead = factory(root.WriRestorationMarketplaceApi.ApiClient, root.WriRestorationMarketplaceApi.CarbonCertificationCreateDraft, root.WriRestorationMarketplaceApi.PitchContactCreateDraft, root.WriRestorationMarketplaceApi.PitchCreate, root.WriRestorationMarketplaceApi.PitchDocumentCreateDraft, root.WriRestorationMarketplaceApi.RestorationMethodMetricCreateDraft, root.WriRestorationMarketplaceApi.TreeSpeciesCreateDraft);
  }
}(this, function(ApiClient, CarbonCertificationCreateDraft, PitchContactCreateDraft, PitchCreate, PitchDocumentCreateDraft, RestorationMethodMetricCreateDraft, TreeSpeciesCreateDraft) {
  'use strict';

  /**
   * The DraftDataPitchRead model module.
   * @module model/DraftDataPitchRead
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>DraftDataPitchRead</code>.
   * @alias module:model/DraftDataPitchRead
   * @class
   */
  var exports = function() {
  };

  /**
   * Constructs a <code>DraftDataPitchRead</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DraftDataPitchRead} obj Optional instance to populate.
   * @return {module:model/DraftDataPitchRead} The populated <code>DraftDataPitchRead</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('pitch'))
        obj.pitch = PitchCreate.constructFromObject(data['pitch']);
      if (data.hasOwnProperty('pitch_documents'))
        obj.pitch_documents = ApiClient.convertToType(data['pitch_documents'], [PitchDocumentCreateDraft]);
      if (data.hasOwnProperty('pitch_contacts'))
        obj.pitch_contacts = PitchContactCreateDraft.constructFromObject(data['pitch_contacts']);
      if (data.hasOwnProperty('carbon_certifications'))
        obj.carbon_certifications = ApiClient.convertToType(data['carbon_certifications'], [CarbonCertificationCreateDraft]);
      if (data.hasOwnProperty('restoration_method_metrics'))
        obj.restoration_method_metrics = ApiClient.convertToType(data['restoration_method_metrics'], [RestorationMethodMetricCreateDraft]);
      if (data.hasOwnProperty('tree_species'))
        obj.tree_species = ApiClient.convertToType(data['tree_species'], [TreeSpeciesCreateDraft]);
    }
    return obj;
  }

  /**
   * @member {module:model/PitchCreate} pitch
   */
  exports.prototype.pitch = undefined;

  /**
   * @member {Array.<module:model/PitchDocumentCreateDraft>} pitch_documents
   */
  exports.prototype.pitch_documents = undefined;

  /**
   * @member {module:model/PitchContactCreateDraft} pitch_contacts
   */
  exports.prototype.pitch_contacts = undefined;

  /**
   * @member {Array.<module:model/CarbonCertificationCreateDraft>} carbon_certifications
   */
  exports.prototype.carbon_certifications = undefined;

  /**
   * @member {Array.<module:model/RestorationMethodMetricCreateDraft>} restoration_method_metrics
   */
  exports.prototype.restoration_method_metrics = undefined;

  /**
   * @member {Array.<module:model/TreeSpeciesCreateDraft>} tree_species
   */
  exports.prototype.tree_species = undefined;

  return exports;

}));
