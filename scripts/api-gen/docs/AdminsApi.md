# WriRestorationMarketplaceApi.AdminsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**adminsAcceptPost**](AdminsApi.md#adminsAcceptPost) | **POST** /admins/accept | Create an admin from an invite
[**adminsGet**](AdminsApi.md#adminsGet) | **GET** /admins | Read all admins
[**adminsIDGet**](AdminsApi.md#adminsIDGet) | **GET** /admins/{ID} | Read an admin
[**adminsIDPatch**](AdminsApi.md#adminsIDPatch) | **PATCH** /admins/{ID} | Update an admin
[**adminsInvitePost**](AdminsApi.md#adminsInvitePost) | **POST** /admins/invite | Invite an admin


<a name="adminsAcceptPost"></a>
# **adminsAcceptPost**
> AdminRead adminsAcceptPost(body)

Create an admin from an invite

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

var body = new WriRestorationMarketplaceApi.AdminAccept(); // AdminAccept | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.adminsAcceptPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AdminAccept**](AdminAccept.md)|  | 

### Return type

[**AdminRead**](AdminRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="adminsGet"></a>
# **adminsGet**
> AdminReadAll adminsGet()

Read all admins

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.adminsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AdminReadAll**](AdminReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="adminsIDGet"></a>
# **adminsIDGet**
> AdminRead adminsIDGet(ID)

Read an admin

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.adminsIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**AdminRead**](AdminRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="adminsIDPatch"></a>
# **adminsIDPatch**
> AdminRead adminsIDPatch(ID, body)

Update an admin

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

var ID = 56; // Number | 

var body = new WriRestorationMarketplaceApi.AdminUpdate(); // AdminUpdate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.adminsIDPatch(ID, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **body** | [**AdminUpdate**](AdminUpdate.md)|  | 

### Return type

[**AdminRead**](AdminRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="adminsInvitePost"></a>
# **adminsInvitePost**
> AdminRead adminsInvitePost(body)

Invite an admin

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

var body = new WriRestorationMarketplaceApi.AdminInvite(); // AdminInvite | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.adminsInvitePost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AdminInvite**](AdminInvite.md)|  | 

### Return type

[**AdminRead**](AdminRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

