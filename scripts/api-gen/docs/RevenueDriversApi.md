# WriRestorationMarketplaceApi.RevenueDriversApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**revenueDriversGet**](RevenueDriversApi.md#revenueDriversGet) | **GET** /revenue_drivers | Read all revenue drivers


<a name="revenueDriversGet"></a>
# **revenueDriversGet**
> RevenueDriverReadAll revenueDriversGet()

Read all revenue drivers

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.RevenueDriversApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.revenueDriversGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RevenueDriverReadAll**](RevenueDriverReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

