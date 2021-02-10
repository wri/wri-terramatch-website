# WriRestorationMarketplaceApi.ElevatorVideosApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**elevatorVideosIDGet**](ElevatorVideosApi.md#elevatorVideosIDGet) | **GET** /elevator_videos/{ID} | Read an elevator video
[**elevatorVideosPost**](ElevatorVideosApi.md#elevatorVideosPost) | **POST** /elevator_videos | Create an elevator video


<a name="elevatorVideosIDGet"></a>
# **elevatorVideosIDGet**
> ElevatorVideoRead elevatorVideosIDGet(ID)

Read an elevator video

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.ElevatorVideosApi();

var ID = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.elevatorVideosIDGet(ID, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**ElevatorVideoRead**](ElevatorVideoRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="elevatorVideosPost"></a>
# **elevatorVideosPost**
> ElevatorVideoRead elevatorVideosPost(body)

Create an elevator video

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.ElevatorVideosApi();

var body = new WriRestorationMarketplaceApi.ElevatorVideoCreate(); // ElevatorVideoCreate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.elevatorVideosPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ElevatorVideoCreate**](ElevatorVideoCreate.md)|  | 

### Return type

[**ElevatorVideoRead**](ElevatorVideoRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

