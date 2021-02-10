/**
 * This function returns a promise around the generated api's callback request
 * @param  {string} apiName Name of the api
 * @param  {string} apiFuntionName Name of the function within the api
 * @param  {Object} body  The model required by the api's function
 * @return {Promise}
 */
export default (api, apiFunctionName, body, jwtToken, ...params) => new Promise((resolve, reject) => {
  api.apiClient.basePath = process.env.REACT_APP_API_URL;

  if (jwtToken) {
    api.apiClient.defaultHeaders = {
      'Authorization': `Bearer ${jwtToken}`
    };
  }

  const callback = (error, data, response) => {
    if (error) {
      reject(error);
    } else {
      resolve(response.body.data);
    }
  };

  if (body && params.length === 0) {
    api[apiFunctionName](body, callback);
  } else if (body && params.length > 0) {
    api[apiFunctionName](...params, body, callback);
  } else if (params.length > 0) {
    api[apiFunctionName](...params, callback);
  } else {
    api[apiFunctionName](callback);
  }
})

export const paginatedApiWrapper = (api, apiFunctionName, body, jwtToken, ...params) => new Promise((resolve, reject) => {
  api.apiClient.basePath = process.env.REACT_APP_API_URL;

  if (jwtToken) {
    api.apiClient.defaultHeaders = {
      'Authorization': `Bearer ${jwtToken}`
    };
  }

  const callback = (error, data, response) => {
    if (error) {
      reject(error);
    } else {
      const respObj = {
        data: response.body.data,
        Pagination: response.body.meta
      }
      resolve(respObj);
    }
  };

  if (body && params.length === 0) {
    api[apiFunctionName](body, callback);
  } else if (body && params.length > 0) {
    api[apiFunctionName](...params, body, callback);
  } else if (params.length > 0) {
    api[apiFunctionName](...params, callback);
  } else {
    api[apiFunctionName](callback);
  }
})