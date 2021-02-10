# WriRestorationMarketplaceApi.DocumentTypesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**documentTypesGet**](DocumentTypesApi.md#documentTypesGet) | **GET** /document_types | Read all document types


<a name="documentTypesGet"></a>
# **documentTypesGet**
> DocumentTypeReadAll documentTypesGet()

Read all document types

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.DocumentTypesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.documentTypesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**DocumentTypeReadAll**](DocumentTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

