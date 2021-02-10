# WriRestorationMarketplaceApi.NotificationsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**notificationsGet**](NotificationsApi.md#notificationsGet) | **GET** /notifications | Read all notifications
[**notificationsIDMarkPatch**](NotificationsApi.md#notificationsIDMarkPatch) | **PATCH** /notifications/{ID}/mark | Mark a notification as read


<a name="notificationsGet"></a>
# **notificationsGet**
> NotificationReadAll notificationsGet()

Read all notifications

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.NotificationsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.notificationsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**NotificationReadAll**](NotificationReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="notificationsIDMarkPatch"></a>
# **notificationsIDMarkPatch**
> NotificationRead notificationsIDMarkPatch(ID)

Mark a notification as read

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.NotificationsApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.notificationsIDMarkPatch(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**NotificationRead**](NotificationRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

