# WriRestorationMarketplaceApi.CarbonCertificationVersionsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**carbonCertificationVersionsIDApprovePatch**](CarbonCertificationVersionsApi.md#carbonCertificationVersionsIDApprovePatch) | **PATCH** /carbon_certification_versions/{ID}/approve | Approve a carbon certification version
[**carbonCertificationVersionsIDDelete**](CarbonCertificationVersionsApi.md#carbonCertificationVersionsIDDelete) | **DELETE** /carbon_certification_versions/{ID} | Delete a carbon certification version
[**carbonCertificationVersionsIDGet**](CarbonCertificationVersionsApi.md#carbonCertificationVersionsIDGet) | **GET** /carbon_certification_versions/{ID} | Read a carbon certification version
[**carbonCertificationVersionsIDRejectPatch**](CarbonCertificationVersionsApi.md#carbonCertificationVersionsIDRejectPatch) | **PATCH** /carbon_certification_versions/{ID}/reject | Reject a carbon certification version
[**carbonCertificationVersionsIDRevivePatch**](CarbonCertificationVersionsApi.md#carbonCertificationVersionsIDRevivePatch) | **PATCH** /carbon_certification_versions/{ID}/revive | Revive a carbon certification version
[**carbonCertificationsIDCarbonCertificationVersionsGet**](CarbonCertificationVersionsApi.md#carbonCertificationsIDCarbonCertificationVersionsGet) | **GET** /carbon_certifications/{ID}/carbon_certification_versions | Read a carbon certification's carbon certification versions


<a name="carbonCertificationVersionsIDApprovePatch"></a>
# **carbonCertificationVersionsIDApprovePatch**
> CarbonCertificationVersionRead carbonCertificationVersionsIDApprovePatch(ID)

Approve a carbon certification version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationVersionsIDApprovePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="carbonCertificationVersionsIDDelete"></a>
# **carbonCertificationVersionsIDDelete**
> Empty carbonCertificationVersionsIDDelete(ID)

Delete a carbon certification version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationVersionsIDDelete(ID, callback);
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

<a name="carbonCertificationVersionsIDGet"></a>
# **carbonCertificationVersionsIDGet**
> CarbonCertificationVersionRead carbonCertificationVersionsIDGet(ID)

Read a carbon certification version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationVersionsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="carbonCertificationVersionsIDRejectPatch"></a>
# **carbonCertificationVersionsIDRejectPatch**
> CarbonCertificationVersionRead carbonCertificationVersionsIDRejectPatch(ID, body)

Reject a carbon certification version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationVersionsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.CarbonCertificationVersionReject(); // CarbonCertificationVersionReject | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationVersionsIDRejectPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**CarbonCertificationVersionReject**](CarbonCertificationVersionReject.md)|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="carbonCertificationVersionsIDRevivePatch"></a>
# **carbonCertificationVersionsIDRevivePatch**
> CarbonCertificationVersionRead carbonCertificationVersionsIDRevivePatch(ID)

Revive a carbon certification version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationVersionsIDRevivePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="carbonCertificationsIDCarbonCertificationVersionsGet"></a>
# **carbonCertificationsIDCarbonCertificationVersionsGet**
> CarbonCertificationVersionReadAll carbonCertificationsIDCarbonCertificationVersionsGet(ID)

Read a carbon certification's carbon certification versions

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationsIDCarbonCertificationVersionsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**CarbonCertificationVersionReadAll**](CarbonCertificationVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

