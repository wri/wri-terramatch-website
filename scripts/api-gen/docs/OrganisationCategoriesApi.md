# WriRestorationMarketplaceApi.OrganisationCategoriesApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationCategoriesGet**](OrganisationCategoriesApi.md#organisationCategoriesGet) | **GET** /organisation_categories | Read all organisation categories


<a name="organisationCategoriesGet"></a>
# **organisationCategoriesGet**
> OrganisationCategoryReadAll organisationCategoriesGet()

Read all organisation categories

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.OrganisationCategoriesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.organisationCategoriesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OrganisationCategoryReadAll**](OrganisationCategoryReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

