# WriRestorationMarketplaceApi.ContinentsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**continentsGet**](ContinentsApi.md#continentsGet) | **GET** /continents | Read all continents


<a name="continentsGet"></a>
# **continentsGet**
> ContinentReadAll continentsGet()

Read all continents

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.ContinentsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.continentsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ContinentReadAll**](ContinentReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

