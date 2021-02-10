# WriRestorationMarketplaceApi.SustainableDevelopmentGoalsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sustainableDevelopmentGoalsGet**](SustainableDevelopmentGoalsApi.md#sustainableDevelopmentGoalsGet) | **GET** /sustainable_development_goals | Read all sustainable development goals


<a name="sustainableDevelopmentGoalsGet"></a>
# **sustainableDevelopmentGoalsGet**
> SustainableDevelopmentGoalReadAll sustainableDevelopmentGoalsGet()

Read all sustainable development goals

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.SustainableDevelopmentGoalsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.sustainableDevelopmentGoalsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SustainableDevelopmentGoalReadAll**](SustainableDevelopmentGoalReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

