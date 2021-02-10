# WriRestorationMarketplaceApi.RestorationMethodsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**restorationMethodsGet**](RestorationMethodsApi.md#restorationMethodsGet) | **GET** /restoration_methods | Read all restoration methods


<a name="restorationMethodsGet"></a>
# **restorationMethodsGet**
> RestorationMethodReadAll restorationMethodsGet()

Read all restoration methods

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.RestorationMethodsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.restorationMethodsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RestorationMethodReadAll**](RestorationMethodReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

