# WriRestorationMarketplaceApi.OrganisationVersionsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationVersionsIDApprovePatch**](OrganisationVersionsApi.md#organisationVersionsIDApprovePatch) | **PATCH** /organisation_versions/{ID}/approve | Approve an organisation version
[**organisationVersionsIDDelete**](OrganisationVersionsApi.md#organisationVersionsIDDelete) | **DELETE** /organisation_versions/{ID} | Delete an organisation version
[**organisationVersionsIDGet**](OrganisationVersionsApi.md#organisationVersionsIDGet) | **GET** /organisation_versions/{ID} | Read an organisation version
[**organisationVersionsIDRejectPatch**](OrganisationVersionsApi.md#organisationVersionsIDRejectPatch) | **PATCH** /organisation_versions/{ID}/reject | Reject an organisation version
[**organisationVersionsIDRevivePatch**](OrganisationVersionsApi.md#organisationVersionsIDRevivePatch) | **PATCH** /organisation_versions/{ID}/revive | Revive an organisation version
[**organisationsIDOrganisationVersionsGet**](OrganisationVersionsApi.md#organisationsIDOrganisationVersionsGet) | **GET** /organisations/{ID}/organisation_versions | Read an organisation's organisation versions


<a name="organisationVersionsIDApprovePatch"></a>
# **organisationVersionsIDApprovePatch**
> OrganisationVersionRead organisationVersionsIDApprovePatch(ID)

Approve an organisation version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationVersionsIDApprovePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDDelete"></a>
# **organisationVersionsIDDelete**
> Empty organisationVersionsIDDelete(ID)

Delete an organisation version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationVersionsIDDelete(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDGet"></a>
# **organisationVersionsIDGet**
> OrganisationVersionRead organisationVersionsIDGet(ID)

Read an organisation version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationVersionsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDRejectPatch"></a>
# **organisationVersionsIDRejectPatch**
> OrganisationVersionRead organisationVersionsIDRejectPatch(ID, body)

Reject an organisation version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.OrganisationVersionReject(); // OrganisationVersionReject | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationVersionsIDRejectPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**OrganisationVersionReject**](OrganisationVersionReject.md)|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDRevivePatch"></a>
# **organisationVersionsIDRevivePatch**
> OrganisationVersionRead organisationVersionsIDRevivePatch(ID)

Revive an organisation version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationVersionsIDRevivePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDOrganisationVersionsGet"></a>
# **organisationsIDOrganisationVersionsGet**
> OrganisationVersionReadAll organisationsIDOrganisationVersionsGet(ID)

Read an organisation's organisation versions

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationsIDOrganisationVersionsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionReadAll**](OrganisationVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

