# WriRestorationMarketplaceApi.CarbonCertificationTypesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**carbonCertificationTypesGet**](CarbonCertificationTypesApi.md#carbonCertificationTypesGet) | **GET** /carbon_certification_types | Read all carbon certification types


<a name="carbonCertificationTypesGet"></a>
# **carbonCertificationTypesGet**
> CarbonCertificationTypeReadAll carbonCertificationTypesGet()

Read all carbon certification types

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationTypesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.carbonCertificationTypesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**CarbonCertificationTypeReadAll**](CarbonCertificationTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

