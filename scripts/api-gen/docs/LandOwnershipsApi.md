# WriRestorationMarketplaceApi.LandOwnershipsApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**landOwnershipsGet**](LandOwnershipsApi.md#landOwnershipsGet) | **GET** /land_ownerships | Read all land ownerships


<a name="landOwnershipsGet"></a>
# **landOwnershipsGet**
> LandOwnershipReadAll landOwnershipsGet()

Read all land ownerships

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.LandOwnershipsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.landOwnershipsGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**LandOwnershipReadAll**](LandOwnershipReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

