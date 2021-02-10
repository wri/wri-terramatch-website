# WriRestorationMarketplaceApi.OrganisationDocumentsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationDocumentsIDDelete**](OrganisationDocumentsApi.md#organisationDocumentsIDDelete) | **DELETE** /organisation_documents/{ID} | Delete an organisation document
[**organisationDocumentsIDGet**](OrganisationDocumentsApi.md#organisationDocumentsIDGet) | **GET** /organisation_documents/{ID} | Read an organisation document
[**organisationDocumentsIDPatch**](OrganisationDocumentsApi.md#organisationDocumentsIDPatch) | **PATCH** /organisation_documents/{ID} | Update an organisation document
[**organisationDocumentsPost**](OrganisationDocumentsApi.md#organisationDocumentsPost) | **POST** /organisation_documents | Create an organisation document
[**organisationsIDOrganisationDocumentsGet**](OrganisationDocumentsApi.md#organisationsIDOrganisationDocumentsGet) | **GET** /organisations/{ID}/organisation_documents | Read an organisation's organisation documents
[**organisationsIDOrganisationDocumentsInspectGet**](OrganisationDocumentsApi.md#organisationsIDOrganisationDocumentsInspectGet) | **GET** /organisations/{ID}/organisation_documents/inspect | Inspect an organisation's organisation documents


<a name="organisationDocumentsIDDelete"></a>
# **organisationDocumentsIDDelete**
> Empty organisationDocumentsIDDelete(ID)

Delete an organisation document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentsIDDelete(ID, callback);
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

<a name="organisationDocumentsIDGet"></a>
# **organisationDocumentsIDGet**
> OrganisationDocumentRead organisationDocumentsIDGet(ID)

Read an organisation document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationDocumentRead**](OrganisationDocumentRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationDocumentsIDPatch"></a>
# **organisationDocumentsIDPatch**
> OrganisationDocumentVersionRead organisationDocumentsIDPatch(ID, body)

Update an organisation document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.OrganisationDocumentUpdate(); // OrganisationDocumentUpdate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentsIDPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**OrganisationDocumentUpdate**](OrganisationDocumentUpdate.md)|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="organisationDocumentsPost"></a>
# **organisationDocumentsPost**
> OrganisationDocumentVersionRead organisationDocumentsPost(body)

Create an organisation document

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

var body = new WriRestorationMarketplaceApi.OrganisationDocumentCreate(); // OrganisationDocumentCreate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentsPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**OrganisationDocumentCreate**](OrganisationDocumentCreate.md)|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="organisationsIDOrganisationDocumentsGet"></a>
# **organisationsIDOrganisationDocumentsGet**
> OrganisationDocumentReadAll organisationsIDOrganisationDocumentsGet(ID)

Read an organisation's organisation documents

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationsIDOrganisationDocumentsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationDocumentReadAll**](OrganisationDocumentReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDOrganisationDocumentsInspectGet"></a>
# **organisationsIDOrganisationDocumentsInspectGet**
> OrganisationDocumentVersionReadAll organisationsIDOrganisationDocumentsInspectGet(ID)

Inspect an organisation's organisation documents

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationsIDOrganisationDocumentsInspectGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationDocumentVersionReadAll**](OrganisationDocumentVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

