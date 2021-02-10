# WriRestorationMarketplaceApi.TreeSpeciesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchesIDTreeSpeciesGet**](TreeSpeciesApi.md#pitchesIDTreeSpeciesGet) | **GET** /pitches/{ID}/tree_species | Read a pitch's tree species
[**pitchesIDTreeSpeciesInspectGet**](TreeSpeciesApi.md#pitchesIDTreeSpeciesInspectGet) | **GET** /pitches/{ID}/tree_species/inspect | Inspect a pitch's tree species
[**treeSpeciesIDDelete**](TreeSpeciesApi.md#treeSpeciesIDDelete) | **DELETE** /tree_species/{ID} | Delete a tree species
[**treeSpeciesIDGet**](TreeSpeciesApi.md#treeSpeciesIDGet) | **GET** /tree_species/{ID} | Read a tree species
[**treeSpeciesIDPatch**](TreeSpeciesApi.md#treeSpeciesIDPatch) | **PATCH** /tree_species/{ID} | Update a tree species
[**treeSpeciesPost**](TreeSpeciesApi.md#treeSpeciesPost) | **POST** /tree_species | Create a tree species


<a name="pitchesIDTreeSpeciesGet"></a>
# **pitchesIDTreeSpeciesGet**
> TreeSpeciesReadAll pitchesIDTreeSpeciesGet(ID)

Read a pitch's tree species

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDTreeSpeciesGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**TreeSpeciesReadAll**](TreeSpeciesReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDTreeSpeciesInspectGet"></a>
# **pitchesIDTreeSpeciesInspectGet**
> TreeSpeciesVersionReadAll pitchesIDTreeSpeciesInspectGet(ID)

Inspect a pitch's tree species

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.pitchesIDTreeSpeciesInspectGet(ID, callback);
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

<a name="treeSpeciesIDDelete"></a>
# **treeSpeciesIDDelete**
> Empty treeSpeciesIDDelete(ID)

Delete a tree species

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesIDDelete(ID, callback);
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

<a name="treeSpeciesIDGet"></a>
# **treeSpeciesIDGet**
> TreeSpeciesRead treeSpeciesIDGet(ID)

Read a tree species

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**TreeSpeciesRead**](TreeSpeciesRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesIDPatch"></a>
# **treeSpeciesIDPatch**
> TreeSpeciesVersionRead treeSpeciesIDPatch(ID, body)

Update a tree species

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.TreeSpeciesUpdate(); // TreeSpeciesUpdate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesIDPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**TreeSpeciesUpdate**](TreeSpeciesUpdate.md)|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="treeSpeciesPost"></a>
# **treeSpeciesPost**
> TreeSpeciesVersionRead treeSpeciesPost(body)

Create a tree species

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

var body = new WriRestorationMarketplaceApi.TreeSpeciesCreate(); // TreeSpeciesCreate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**TreeSpeciesCreate**](TreeSpeciesCreate.md)|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

