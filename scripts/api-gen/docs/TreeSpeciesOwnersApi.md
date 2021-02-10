# WriRestorationMarketplaceApi.TreeSpeciesOwnersApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**treeSpeciesOwnersGet**](TreeSpeciesOwnersApi.md#treeSpeciesOwnersGet) | **GET** /tree_species_owners | Read all tree species owners


<a name="treeSpeciesOwnersGet"></a>
# **treeSpeciesOwnersGet**
> TreeSpeciesOwnerReadAll treeSpeciesOwnersGet()

Read all tree species owners

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesOwnersApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.treeSpeciesOwnersGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TreeSpeciesOwnerReadAll**](TreeSpeciesOwnerReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

