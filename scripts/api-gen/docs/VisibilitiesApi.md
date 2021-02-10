# WriRestorationMarketplaceApi.VisibilitiesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**visibilitiesGet**](VisibilitiesApi.md#visibilitiesGet) | **GET** /visibilities | Read all visibilities


<a name="visibilitiesGet"></a>
# **visibilitiesGet**
> VisibilityReadAll visibilitiesGet()

Read all visibilities

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.VisibilitiesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.visibilitiesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**VisibilityReadAll**](VisibilityReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

