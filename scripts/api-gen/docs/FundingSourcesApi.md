# WriRestorationMarketplaceApi.FundingSourcesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**fundingSourcesGet**](FundingSourcesApi.md#fundingSourcesGet) | **GET** /funding_sources | Read all funding sources


<a name="fundingSourcesGet"></a>
# **fundingSourcesGet**
> FundingSourceReadAll fundingSourcesGet()

Read all funding sources

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.FundingSourcesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.fundingSourcesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FundingSourceReadAll**](FundingSourceReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

