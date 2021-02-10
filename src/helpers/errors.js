import validators from '../components/formWalkthrough/FormValidators';

export const validateField = (field, newValue, model, childModels) => {
  if (field.validationFuncName) {
    if (!validators[field.validationFuncName]) {
      throw new Error(`No such validator exists, ${field.validationFuncName}`);
    }
    return validators[field.validationFuncName](field, newValue);
  }

  if (field.validationFunc) {
    return field.validationFunc(field, newValue, model, childModels);
  }

  return true;
}

const isUploadError = (err) => {
  return err.source === 'upload' ||
         err.source === 'video' ||
         err.source === 'avatar' ||
         err.source === 'cover_photo' ||
         err.source === 'media_upload';
};

/**
 * Convert max upload attribute to MB
 * (divide by 1000, not 1024 as BED return in 1000s)
 */
const convertAttributesToMB = (errorArray) => {
  errorArray.forEach((err) =>  {
    if (err.variables && err.variables.max && isUploadError(err)) {
      err.variables.max = parseInt(err.variables.max, 10) / 1000;
    }
  });

  return errorArray;
}

/**
 * Get the error array from a response
 * @param  {object} response Response object from the API client
 * @return {Array}           Array of errors
 */
export const getRawResponseErrors = (response) => {
  let errorArray = [];

  if (response.error &&
      response.error.response &&
      response.error.response.body &&
      response.error.response.body.errors) {
    errorArray = convertAttributesToMB(
      JSON.parse(JSON.stringify(response.error.response.body.errors))
    );
  } else if (response.error && !response.error.response) {
    errorArray = [{
      source: 'unknown',
      code: 'GENERIC'
    }];
  }

  return errorArray;
};

/**
 * Get the errors from a response from the API client
 * @param  {object} response Response object from the API client
 * @return {object} Parsed errors as an object
 */
export const getResponseErrors = (response) => {
  const errors = {}

  const errorArray = getRawResponseErrors(response);

  for (let i in errorArray) {
    const error = errorArray[i];
    if (errors[error.source]) {
      errors[error.source].push(error);
    } else {
      errors[error.source] = [error];
    }
  }

  return errors;
};
