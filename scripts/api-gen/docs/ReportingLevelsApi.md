# WriRestorationMarketplaceApi.ReportingLevelsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**reportingLevelsGet**](ReportingLevelsApi.md#reportingLevelsGet) | **GET** /reporting_levels | Read all reporting levels


<a name="reportingLevelsGet"></a>
# **reportingLevelsGet**
> ReportingLevelReadAll reportingLevelsGet()

Read all reporting levels

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.ReportingLevelsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.reportingLevelsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ReportingLevelReadAll**](ReportingLevelReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

