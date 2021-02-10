# WriRestorationMarketplaceApi.RestorationGoalsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**restorationGoalsGet**](RestorationGoalsApi.md#restorationGoalsGet) | **GET** /restoration_goals | Read all restoration goals


<a name="restorationGoalsGet"></a>
# **restorationGoalsGet**
> RestorationGoalReadAll restorationGoalsGet()

Read all restoration goals

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.RestorationGoalsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationGoalsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RestorationGoalReadAll**](RestorationGoalReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

