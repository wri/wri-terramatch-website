const URL_REGEX = /((https|http)?:\/\/)?(www.)?[-a-zA-Z0-9@:%_\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; // eslint-disable-line

const base64FileSizeCheck = (field, value) => {
  let hasError = false;
  let code = '';
  if (!value) {
    throw new Error(`Error attempting to validate ${field.modelKey}, no value provided`);
  }

  if (!field.base64Limit) {
    throw new Error(`No base64Limit set on field for ${field.modelKey}`);
  }

  if (value.length > field.base64Limit) {
    hasError = true;
    code = `BETWEEN`;
  }

  return {
    error: hasError,
    code: code
  };
};

const requiredCheck = (field, value) => {
  let hasError = false;
  let code = '';

  if (value === '' || value === null || value === undefined) {
    hasError = true;
    code = 'REQUIRED'
  }

  return {
    error: hasError,
    code: code
  };
};

const notEmptyArrayCheck = (field, value)=> {
  const required = requiredCheck(field, value);

  if (required.error) {
    return required;
  }

  let hasError = false;
  let code = '';

  if (value.length === 0) {
    hasError = true;
    code = 'REQUIRED'
  }

  return {
    error: hasError,
    code: code
  };
};

const betweenMinMax = (field, value, min, max) => {
  let hasError = false;
  let code = '';

  if (Number(value) > max || Number(value) < min) {
    hasError = true;
    code = 'BETWEEN'
  }

  return {
    error: hasError,
    code: code,
    variables: {
      min, max
    }
  };
};

const numberAtleast = (field, value, min) => {
  let hasError = false;
  let code = '';

  if (Number(value) < min) {
    hasError = true;
    code = 'MIN'
  }

  return {
    error: hasError,
    code: code,
    variables: {
      min
    }
  };
};

const uniqueArray = (field, value) => {
  let hasError = false;
  let code = '';

  const uniqueArray = [...new Set(value)];

  if (value && value.length > uniqueArray.length) {
    hasError = true;
    code = 'UNIQUE'
  }

  return {
    error: hasError,
    code: code
  };
};

const arrayStringAtLeast = (field, value, min) => {
  let hasError = false;
  let code = '';

  if (value) {
    value.forEach(item => {
      if (item.length < min) {
        hasError = true;
        code = 'MINSTR'
      }
    })
  }

  return {
    error: hasError,
    code: code
  };
};

const validUrl = (field, value) => {
  let hasError = false;
  let code = '';

  if (!(!field.required && !value) && !URL_REGEX.test(value)) {
    hasError = true;
    code = 'INVALID';
  }

  return {
    error: hasError,
    code: code
  };
};

export default {
  base64FileSizeCheck,
  requiredCheck,
  notEmptyArrayCheck,
  betweenMinMax,
  uniqueArray,
  numberAtleast,
  arrayStringAtLeast,
  validUrl
};
