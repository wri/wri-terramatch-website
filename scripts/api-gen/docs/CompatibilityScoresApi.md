# WriRestorationMarketplaceApi.CompatibilityScoresApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**compatibilityScoresPost**](CompatibilityScoresApi.md#compatibilityScoresPost) | **POST** /compatibility_scores | Read a compatibility score


<a name="compatibilityScoresPost"></a>
# **compatibilityScoresPost**
> InlineResponse200 compatibilityScoresPost(body)

Read a compatibility score

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.CompatibilityScoresApi();

var body = new WriRestorationMarketplaceApi.CompatibilityScoreCreate(); // CompatibilityScoreCreate | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.compatibilityScoresPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**CompatibilityScoreCreate**](CompatibilityScoreCreate.md)|  | 

### Return type

[**InlineResponse200**](InlineResponse200.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

