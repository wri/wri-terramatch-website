# WriRestorationMarketplaceApi.RestorationMethodMetricsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchesIDRestorationMethodMetricsGet**](RestorationMethodMetricsApi.md#pitchesIDRestorationMethodMetricsGet) | **GET** /pitches/{ID}/restoration_method_metrics | Read a pitch's restoration method metrics
[**pitchesIDRestorationMethodMetricsInspectGet**](RestorationMethodMetricsApi.md#pitchesIDRestorationMethodMetricsInspectGet) | **GET** /pitches/{ID}/restoration_method_metrics/inspect | Inspect a pitch's restoration method metrics
[**restorationMethodMetricsIDDelete**](RestorationMethodMetricsApi.md#restorationMethodMetricsIDDelete) | **DELETE** /restoration_method_metrics/{ID} | Delete a restoration method metric
[**restorationMethodMetricsIDGet**](RestorationMethodMetricsApi.md#restorationMethodMetricsIDGet) | **GET** /restoration_method_metrics/{ID} | Read a restoration method metric
[**restorationMethodMetricsIDPatch**](RestorationMethodMetricsApi.md#restorationMethodMetricsIDPatch) | **PATCH** /restoration_method_metrics/{ID} | Update a restoration method metric
[**restorationMethodMetricsPost**](RestorationMethodMetricsApi.md#restorationMethodMetricsPost) | **POST** /restoration_method_metrics | Create a restoration method metric


<a name="pitchesIDRestorationMethodMetricsGet"></a>
# **pitchesIDRestorationMethodMetricsGet**
> RestorationMethodMetricReadAll pitchesIDRestorationMethodMetricsGet(ID)

Read a pitch's restoration method metrics

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDRestorationMethodMetricsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**RestorationMethodMetricReadAll**](RestorationMethodMetricReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDRestorationMethodMetricsInspectGet"></a>
# **pitchesIDRestorationMethodMetricsInspectGet**
> RestorationMethodMetricVersionReadAll pitchesIDRestorationMethodMetricsInspectGet(ID)

Inspect a pitch's restoration method metrics

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDRestorationMethodMetricsInspectGet(ID, callback);
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

<a name="restorationMethodMetricsIDDelete"></a>
# **restorationMethodMetricsIDDelete**
> Empty restorationMethodMetricsIDDelete(ID)

Delete a restoration method metric

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricsIDDelete(ID, callback);
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

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="restorationMethodMetricsIDGet"></a>
# **restorationMethodMetricsIDGet**
> RestorationMethodMetricRead restorationMethodMetricsIDGet(ID)

Read a restoration method metric

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**RestorationMethodMetricRead**](RestorationMethodMetricRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricsIDPatch"></a>
# **restorationMethodMetricsIDPatch**
> RestorationMethodMetricVersionRead restorationMethodMetricsIDPatch(ID, body)

Update a restoration method metric

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.RestorationMethodMetricUpdate(); // RestorationMethodMetricUpdate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricsIDPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**RestorationMethodMetricUpdate**](RestorationMethodMetricUpdate.md)|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="restorationMethodMetricsPost"></a>
# **restorationMethodMetricsPost**
> RestorationMethodMetricVersionRead restorationMethodMetricsPost(body)

Create a restoration method metric

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

var body = new WriRestorationMarketplaceApi.RestorationMethodMetricCreate(); // RestorationMethodMetricCreate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodMetricsPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**RestorationMethodMetricCreate**](RestorationMethodMetricCreate.md)|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

