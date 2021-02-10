# WriRestorationMarketplaceApi.AuthApi

All URIs are relative to *https://test.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authChangePatch**](AuthApi.md#authChangePatch) | **PATCH** /auth/change | Reset a user's or admin's password
[**authLoginPost**](AuthApi.md#authLoginPost) | **POST** /auth/login | Log a user or admin in
[**authLogoutGet**](AuthApi.md#authLogoutGet) | **GET** /auth/logout | Log the logged in user or admin out
[**authMeGet**](AuthApi.md#authMeGet) | **GET** /auth/me | Read the logged in user or admin
[**authRefreshGet**](AuthApi.md#authRefreshGet) | **GET** /auth/refresh | Refresh the logged in user's or admin's JWT token
[**authResendGet**](AuthApi.md#authResendGet) | **GET** /auth/resend | Send a verification email to the logged in user or admin
[**authResetPost**](AuthApi.md#authResetPost) | **POST** /auth/reset | Send a password reset email to a user or admin
[**authVerifyPatch**](AuthApi.md#authVerifyPatch) | **PATCH** /auth/verify | Verify the logged in user's or admin's email address


<a name="authChangePatch"></a>
# **authChangePatch**
> Empty authChangePatch(body)

Reset a user's or admin's password

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var body = new WriRestorationMarketplaceApi.AuthChange(); // AuthChange | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authChangePatch(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AuthChange**](AuthChange.md)|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="authLoginPost"></a>
# **authLoginPost**
> TokenRead authLoginPost(body)

Log a user or admin in

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var body = new WriRestorationMarketplaceApi.AuthLogIn(); // AuthLogIn | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authLoginPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AuthLogIn**](AuthLogIn.md)|  | 

### Return type

[**TokenRead**](TokenRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="authLogoutGet"></a>
# **authLogoutGet**
> Empty authLogoutGet()

Log the logged in user or admin out

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authLogoutGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authMeGet"></a>
# **authMeGet**
> UserRead authMeGet()

Read the logged in user or admin

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authMeGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserRead**](UserRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authRefreshGet"></a>
# **authRefreshGet**
> TokenRead authRefreshGet()

Refresh the logged in user's or admin's JWT token

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authRefreshGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TokenRead**](TokenRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authResendGet"></a>
# **authResendGet**
> Empty authResendGet()

Send a verification email to the logged in user or admin

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authResendGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authResetPost"></a>
# **authResetPost**
> Empty authResetPost(body)

Send a password reset email to a user or admin

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var body = new WriRestorationMarketplaceApi.AuthReset(); // AuthReset | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authResetPost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AuthReset**](AuthReset.md)|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="authVerifyPatch"></a>
# **authVerifyPatch**
> Empty authVerifyPatch(body)

Verify the logged in user's or admin's email address

### Example
```javascript
var WriRestorationMarketplaceApi = require('wri_restoration_marketplace_api');
var defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
var BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

var apiInstance = new WriRestorationMarketplaceApi.AuthApi();

var body = new WriRestorationMarketplaceApi.AuthVerify(); // AuthVerify | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authVerifyPatch(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AuthVerify**](AuthVerify.md)|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

