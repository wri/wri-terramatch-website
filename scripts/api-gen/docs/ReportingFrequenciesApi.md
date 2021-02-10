# WriRestorationMarketplaceApi.ReportingFrequenciesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**reportingFrequenciesGet**](ReportingFrequenciesApi.md#reportingFrequenciesGet) | **GET** /reporting_frequencies | Read all reporting frequencies


<a name="reportingFrequenciesGet"></a>
# **reportingFrequenciesGet**
> ReportingFrequencyReadAll reportingFrequenciesGet()

Read all reporting frequencies

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.ReportingFrequenciesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.reportingFrequenciesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ReportingFrequencyReadAll**](ReportingFrequencyReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

