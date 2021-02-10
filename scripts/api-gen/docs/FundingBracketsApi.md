# WriRestorationMarketplaceApi.FundingBracketsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**fundingBracketsGet**](FundingBracketsApi.md#fundingBracketsGet) | **GET** /funding_brackets | Read all funding brackets


<a name="fundingBracketsGet"></a>
# **fundingBracketsGet**
> FundingBracketReadAll fundingBracketsGet()

Read all funding brackets

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.FundingBracketsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.fundingBracketsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FundingBracketReadAll**](FundingBracketReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

