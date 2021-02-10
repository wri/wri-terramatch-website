# WriRestorationMarketplaceApi.TreeSpeciesVersionsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**treeSpeciesIDTreeSpeciesVersionsGet**](TreeSpeciesVersionsApi.md#treeSpeciesIDTreeSpeciesVersionsGet) | **GET** /tree_species/{ID}/tree_species_versions | Read a tree species's tree species versions
[**treeSpeciesVersionsIDApprovePatch**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDApprovePatch) | **PATCH** /tree_species_versions/{ID}/approve | Approve a tree species version
[**treeSpeciesVersionsIDDelete**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDDelete) | **DELETE** /tree_species_versions/{ID} | Delete a tree species version
[**treeSpeciesVersionsIDGet**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDGet) | **GET** /tree_species_versions/{ID} | Read a tree species version
[**treeSpeciesVersionsIDRejectPatch**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDRejectPatch) | **PATCH** /tree_species_versions/{ID}/reject | Reject a tree species version
[**treeSpeciesVersionsIDRevivePatch**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDRevivePatch) | **PATCH** /tree_species_versions/{ID}/revive | Revive a tree species version


<a name="treeSpeciesIDTreeSpeciesVersionsGet"></a>
# **treeSpeciesIDTreeSpeciesVersionsGet**
> TreeSpeciesVersionReadAll treeSpeciesIDTreeSpeciesVersionsGet(ID)

Read a tree species's tree species versions

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesIDTreeSpeciesVersionsGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**TreeSpeciesVersionReadAll**](TreeSpeciesVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesVersionsIDApprovePatch"></a>
# **treeSpeciesVersionsIDApprovePatch**
> TreeSpeciesVersionRead treeSpeciesVersionsIDApprovePatch(ID)

Approve a tree species version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesVersionsIDApprovePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesVersionsIDDelete"></a>
# **treeSpeciesVersionsIDDelete**
> Empty treeSpeciesVersionsIDDelete(ID)

Delete a tree species version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesVersionsIDDelete(ID, callback);
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

<a name="treeSpeciesVersionsIDGet"></a>
# **treeSpeciesVersionsIDGet**
> TreeSpeciesVersionRead treeSpeciesVersionsIDGet(ID)

Read a tree species version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesVersionsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesVersionsIDRejectPatch"></a>
# **treeSpeciesVersionsIDRejectPatch**
> TreeSpeciesVersionRead treeSpeciesVersionsIDRejectPatch(ID, body)

Reject a tree species version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.TreeSpeciesVersionReject(); // TreeSpeciesVersionReject | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesVersionsIDRejectPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**TreeSpeciesVersionReject**](TreeSpeciesVersionReject.md)|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesVersionsIDRevivePatch"></a>
# **treeSpeciesVersionsIDRevivePatch**
> TreeSpeciesVersionRead treeSpeciesVersionsIDRevivePatch(ID)

Revive a tree species version

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesVersionsIDRevivePatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

