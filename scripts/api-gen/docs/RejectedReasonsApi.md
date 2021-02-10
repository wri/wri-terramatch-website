# WriRestorationMarketplaceApi.RejectedReasonsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**rejectedReasonsGet**](RejectedReasonsApi.md#rejectedReasonsGet) | **GET** /rejected_reasons | Read all rejected reasons


<a name="rejectedReasonsGet"></a>
# **rejectedReasonsGet**
> RejectedReasonReadAll rejectedReasonsGet()

Read all rejected reasons

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.RejectedReasonsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.rejectedReasonsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RejectedReasonReadAll**](RejectedReasonReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

