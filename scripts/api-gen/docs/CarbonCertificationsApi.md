# WriRestorationMarketplaceApi.CarbonCertificationsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**carbonCertificationsIDDelete**](CarbonCertificationsApi.md#carbonCertificationsIDDelete) | **DELETE** /carbon_certifications/{ID} | Delete a carbon certification
[**carbonCertificationsIDGet**](CarbonCertificationsApi.md#carbonCertificationsIDGet) | **GET** /carbon_certifications/{ID} | Read a carbon certification
[**carbonCertificationsIDPatch**](CarbonCertificationsApi.md#carbonCertificationsIDPatch) | **PATCH** /carbon_certifications/{ID} | Update a carbon certification
[**carbonCertificationsPost**](CarbonCertificationsApi.md#carbonCertificationsPost) | **POST** /carbon_certifications | Create a carbon certification
[**pitchesIDCarbonCertificationsGet**](CarbonCertificationsApi.md#pitchesIDCarbonCertificationsGet) | **GET** /pitches/{ID}/carbon_certifications | Read a pitch's carbon certifications
[**pitchesIDCarbonCertificationsInspectGet**](CarbonCertificationsApi.md#pitchesIDCarbonCertificationsInspectGet) | **GET** /pitches/{ID}/carbon_certifications/inspect | Inspect a pitch's carbon certifications


<a name="carbonCertificationsIDDelete"></a>
# **carbonCertificationsIDDelete**
> Empty carbonCertificationsIDDelete(ID)

Delete a carbon certification

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationsIDDelete(ID, callback);
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

<a name="carbonCertificationsIDGet"></a>
# **carbonCertificationsIDGet**
> CarbonCertificationRead carbonCertificationsIDGet(ID)

Read a carbon certification

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**CarbonCertificationRead**](CarbonCertificationRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="carbonCertificationsIDPatch"></a>
# **carbonCertificationsIDPatch**
> CarbonCertificationVersionRead carbonCertificationsIDPatch(ID, body)

Update a carbon certification

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.CarbonCertificationUpdate(); // CarbonCertificationUpdate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationsIDPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**CarbonCertificationUpdate**](CarbonCertificationUpdate.md)|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="carbonCertificationsPost"></a>
# **carbonCertificationsPost**
> CarbonCertificationVersionRead carbonCertificationsPost(body)

Create a carbon certification

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

var body = new WriRestorationMarketplaceApi.CarbonCertificationCreate(); // CarbonCertificationCreate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationsPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**CarbonCertificationCreate**](CarbonCertificationCreate.md)|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesIDCarbonCertificationsGet"></a>
# **pitchesIDCarbonCertificationsGet**
> CarbonCertificationReadAll pitchesIDCarbonCertificationsGet(ID)

Read a pitch's carbon certifications

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDCarbonCertificationsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**CarbonCertificationReadAll**](CarbonCertificationReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDCarbonCertificationsInspectGet"></a>
# **pitchesIDCarbonCertificationsInspectGet**
> CarbonCertificationVersionReadAll pitchesIDCarbonCertificationsInspectGet(ID)

Inspect a pitch's carbon certifications

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDCarbonCertificationsInspectGet(ID, callback);
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

