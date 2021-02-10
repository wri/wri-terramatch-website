# WriRestorationMarketplaceApi.OrganisationDocumentVersionsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationDocumentVersionsIDApprovePatch**](OrganisationDocumentVersionsApi.md#organisationDocumentVersionsIDApprovePatch) | **PATCH** /organisation_document_versions/{ID}/approve | Approve an organisation document version
[**organisationDocumentVersionsIDDelete**](OrganisationDocumentVersionsApi.md#organisationDocumentVersionsIDDelete) | **DELETE** /organisation_document_versions/{ID} | Delete an organisation document version
[**organisationDocumentVersionsIDGet**](OrganisationDocumentVersionsApi.md#organisationDocumentVersionsIDGet) | **GET** /organisation_document_versions/{ID} | Read an organisation document version
[**organisationDocumentVersionsIDRejectPatch**](OrganisationDocumentVersionsApi.md#organisationDocumentVersionsIDRejectPatch) | **PATCH** /organisation_document_versions/{ID}/reject | Reject an organisation document version
[**organisationDocumentVersionsIDRevivePatch**](OrganisationDocumentVersionsApi.md#organisationDocumentVersionsIDRevivePatch) | **PATCH** /organisation_document_versions/{ID}/revive | Revive an organisation document version
[**organisationDocumentsIDOrganisationDocumentVersionsGet**](OrganisationDocumentVersionsApi.md#organisationDocumentsIDOrganisationDocumentVersionsGet) | **GET** /organisation_documents/{ID}/organisation_document_versions | Read an organisation document's organisation document versions


<a name="organisationDocumentVersionsIDApprovePatch"></a>
# **organisationDocumentVersionsIDApprovePatch**
> OrganisationDocumentVersionRead organisationDocumentVersionsIDApprovePatch(ID)

Approve an organisation document version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentVersionsIDApprovePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationDocumentVersionsIDDelete"></a>
# **organisationDocumentVersionsIDDelete**
> Empty organisationDocumentVersionsIDDelete(ID)

Delete an organisation document version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentVersionsIDDelete(ID, callback);
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

<a name="organisationDocumentVersionsIDGet"></a>
# **organisationDocumentVersionsIDGet**
> OrganisationDocumentVersionRead organisationDocumentVersionsIDGet(ID)

Read an organisation document version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentVersionsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationDocumentVersionsIDRejectPatch"></a>
# **organisationDocumentVersionsIDRejectPatch**
> OrganisationDocumentVersionRead organisationDocumentVersionsIDRejectPatch(ID, body)

Reject an organisation document version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentVersionsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.OrganisationDocumentVersionReject(); // OrganisationDocumentVersionReject | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentVersionsIDRejectPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**OrganisationDocumentVersionReject**](OrganisationDocumentVersionReject.md)|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationDocumentVersionsIDRevivePatch"></a>
# **organisationDocumentVersionsIDRevivePatch**
> OrganisationDocumentVersionRead organisationDocumentVersionsIDRevivePatch(ID)

Revive an organisation document version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentVersionsIDRevivePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationDocumentsIDOrganisationDocumentVersionsGet"></a>
# **organisationDocumentsIDOrganisationDocumentVersionsGet**
> OrganisationDocumentVersionReadAll organisationDocumentsIDOrganisationDocumentVersionsGet(ID)

Read an organisation document's organisation document versions

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationDocumentsIDOrganisationDocumentVersionsGet(ID, callback);
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

