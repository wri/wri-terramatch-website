# WriRestorationMarketplaceApi.PitchDocumentsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchDocumentsIDDelete**](PitchDocumentsApi.md#pitchDocumentsIDDelete) | **DELETE** /pitch_documents/{ID} | Delete a pitch document
[**pitchDocumentsIDGet**](PitchDocumentsApi.md#pitchDocumentsIDGet) | **GET** /pitch_documents/{ID} | Read a pitch document
[**pitchDocumentsIDPatch**](PitchDocumentsApi.md#pitchDocumentsIDPatch) | **PATCH** /pitch_documents/{ID} | Update a pitch document
[**pitchDocumentsPost**](PitchDocumentsApi.md#pitchDocumentsPost) | **POST** /pitch_documents | Create a pitch document
[**pitchesIDPitchDocumentsGet**](PitchDocumentsApi.md#pitchesIDPitchDocumentsGet) | **GET** /pitches/{ID}/pitch_documents | Read a pitch's pitch documents
[**pitchesIDPitchDocumentsInspectGet**](PitchDocumentsApi.md#pitchesIDPitchDocumentsInspectGet) | **GET** /pitches/{ID}/pitch_documents/inspect | Inspect a pitch's pitch documents


<a name="pitchDocumentsIDDelete"></a>
# **pitchDocumentsIDDelete**
> Empty pitchDocumentsIDDelete(ID)

Delete a pitch document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchDocumentsIDDelete(ID, callback);
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

<a name="pitchDocumentsIDGet"></a>
# **pitchDocumentsIDGet**
> PitchDocumentRead pitchDocumentsIDGet(ID)

Read a pitch document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchDocumentsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**PitchDocumentRead**](PitchDocumentRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchDocumentsIDPatch"></a>
# **pitchDocumentsIDPatch**
> PitchDocumentVersionRead pitchDocumentsIDPatch(ID, body)

Update a pitch document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.PitchDocumentUpdate(); // PitchDocumentUpdate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchDocumentsIDPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**PitchDocumentUpdate**](PitchDocumentUpdate.md)|  | 

### Return type

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchDocumentsPost"></a>
# **pitchDocumentsPost**
> PitchDocumentVersionRead pitchDocumentsPost(body)

Create a pitch document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

var body = new WriRestorationMarketplaceApi.PitchDocumentCreate(); // PitchDocumentCreate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchDocumentsPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PitchDocumentCreate**](PitchDocumentCreate.md)|  | 

### Return type

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesIDPitchDocumentsGet"></a>
# **pitchesIDPitchDocumentsGet**
> PitchDocumentReadAll pitchesIDPitchDocumentsGet(ID)

Read a pitch's pitch documents

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDPitchDocumentsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**PitchDocumentReadAll**](PitchDocumentReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDPitchDocumentsInspectGet"></a>
# **pitchesIDPitchDocumentsInspectGet**
> PitchDocumentVersionReadAll pitchesIDPitchDocumentsInspectGet(ID)

Inspect a pitch's pitch documents

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDPitchDocumentsInspectGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**PitchDocumentVersionReadAll**](PitchDocumentVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

