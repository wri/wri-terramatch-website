# WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**restorationMethodMetricVersionsIDApprovePatch**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDApprovePatch) | **PATCH** /restoration_method_metric_versions/{ID}/approve | Approve a restoration method metric version
[**restorationMethodMetricVersionsIDDelete**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDDelete) | **DELETE** /restoration_method_metric_versions/{ID} | Delete a restoration method metric version
[**restorationMethodMetricVersionsIDGet**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDGet) | **GET** /restoration_method_metric_versions/{ID} | Read a restoration method metric version
[**restorationMethodMetricVersionsIDRejectPatch**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDRejectPatch) | **PATCH** /restoration_method_metric_versions/{ID}/reject | Reject a restoration method metric version
[**restorationMethodMetricVersionsIDRevivePatch**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDRevivePatch) | **PATCH** /restoration_method_metric_versions/{ID}/revive | Revive a restoration method metric version
[**restorationMethodMetricsIDRestorationMethodMetricVersionsGet**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricsIDRestorationMethodMetricVersionsGet) | **GET** /restoration_method_metrics/{ID}/restoration_method_metric_versions | Read a restoration method metric's restoration method metric versions


<a name="restorationMethodMetricVersionsIDApprovePatch"></a>
# **restorationMethodMetricVersionsIDApprovePatch**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDApprovePatch(ID)

Approve a restoration method metric version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricVersionsIDApprovePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricVersionsIDDelete"></a>
# **restorationMethodMetricVersionsIDDelete**
> Empty restorationMethodMetricVersionsIDDelete(ID)

Delete a restoration method metric version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricVersionsIDDelete(ID, callback);
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

<a name="restorationMethodMetricVersionsIDGet"></a>
# **restorationMethodMetricVersionsIDGet**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDGet(ID)

Read a restoration method metric version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricVersionsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricVersionsIDRejectPatch"></a>
# **restorationMethodMetricVersionsIDRejectPatch**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDRejectPatch(ID, body)

Reject a restoration method metric version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionReject(); // RestorationMethodMetricVersionReject | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricVersionsIDRejectPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**RestorationMethodMetricVersionReject**](RestorationMethodMetricVersionReject.md)|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricVersionsIDRevivePatch"></a>
# **restorationMethodMetricVersionsIDRevivePatch**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDRevivePatch(ID)

Revive a restoration method metric version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricVersionsIDRevivePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricsIDRestorationMethodMetricVersionsGet"></a>
# **restorationMethodMetricsIDRestorationMethodMetricVersionsGet**
> RestorationMethodMetricVersionReadAll restorationMethodMetricsIDRestorationMethodMetricVersionsGet(ID)

Read a restoration method metric's restoration method metric versions

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricsIDRestorationMethodMetricVersionsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**RestorationMethodMetricVersionReadAll**](RestorationMethodMetricVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

