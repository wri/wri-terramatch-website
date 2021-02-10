# WriRestorationMarketplaceApi.OrganisationTypesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationTypesGet**](OrganisationTypesApi.md#organisationTypesGet) | **GET** /organisation_types | Read all organisation types


<a name="organisationTypesGet"></a>
# **organisationTypesGet**
> OrganisationTypeReadAll organisationTypesGet()

Read all organisation types

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.OrganisationTypesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationTypesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OrganisationTypeReadAll**](OrganisationTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

