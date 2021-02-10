# WriRestorationMarketplaceApi.LandTypesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**landTypesGet**](LandTypesApi.md#landTypesGet) | **GET** /land_types | Read all land types


<a name="landTypesGet"></a>
# **landTypesGet**
> LandTypeReadAll landTypesGet()

Read all land types

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.LandTypesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.landTypesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**LandTypeReadAll**](LandTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

