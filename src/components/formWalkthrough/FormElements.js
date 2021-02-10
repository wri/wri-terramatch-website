import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FORM_TYPES from '../formInput/FormInputTypes';
import FormElement from './FormElement';
import { validateField } from '../../helpers';

const Elements = (props) => {
  const { fields, updateField, model, errors, validationErrorsAfterSubmit, dispatchMethod, removeFromList, childModels } = props;
  const [ validationErrors, setValidationErrors ] = useState([]);
  const [ parsedErrors, setParsedErrors ] = useState({});

  const { t } = useTranslation();

  useEffect(() => {
    const parsed = {};
    const allErrors = [...errors, ...validationErrorsAfterSubmit, ...validationErrors];
    for (let i in allErrors) {
      const error = allErrors[i];
      if (parsed[error.source] && !parsed[error.code] === error.code) {
        parsed[error.source].push(error);
      } else {
        parsed[error.source] = [error];
      }
    }
    setParsedErrors(parsed);
  }, [errors, validationErrorsAfterSubmit, validationErrors]);

  // If Field type is a File upload, set the ID of the upload when it has succeeded.
  useEffect(() => {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i].type
      const canUpdate = field === FORM_TYPES.file &&
          field.uploadState &&
          field.uploadState.lastSuccessTime &&
          !field.uploadState.errors;

      if (canUpdate) {
        updateField(field.uploadState.data.id, field);
      }
    }
  }, [fields, updateField]);

  const onFieldChange = async (e, field) => {
    let newValue = null;

    switch (field.type) {
      case FORM_TYPES.radioGroup:
      case FORM_TYPES.checkboxGroup:
      case FORM_TYPES.multiText:
      case FORM_TYPES.userSelect:
      case FORM_TYPES.multiUpload:
        newValue = e.value;
        break;
      case FORM_TYPES.asyncSelect:
      case FORM_TYPES.select:
        if (e === null) {
          newValue = undefined;
        } else {
          newValue = e.value;
        }
        break;
      case FORM_TYPES.checkbox:
        newValue = e.target.checked;
        break;

      case FORM_TYPES.file:
        const file = e.target.files[0];

        if (file) {
          dispatchMethod(field.uploadMethod, {file});
          field.fileName = file.name;
        } else {
          field.fileName = '';
        }

        newValue = e.target.files;
        break;
      case FORM_TYPES.map:
        newValue = JSON.stringify(e.value);
        break;
      case FORM_TYPES.date:
        newValue = e;
        break;
      default:
        newValue = e.target.value
        break;
    }

    const validationResult = validateField(field, newValue, model, childModels);

    if (e && e.changeCount === 0 && validationResult !== true) {
      validationResult.error = false;
    }

    let errorArr = [];

    if (!validationResult.error) {
      errorArr = clearValidationError(field.modelKey);
      updateField(newValue, field);
    } else {
      const errorObject = {
        source: field.modelKey,
        code: validationResult.code,
        variables: validationResult.variables
      }

      errorArr = addValidationError(errorObject);
      if (field.shouldSetOnError) {
        updateField(newValue, field);
      }
    }

    setValidationErrors(errorArr);
  }

  const addValidationError = (newError) => {
    const errorArr = clearValidationError(newError.source);
    errorArr.push(newError);
    return errorArr;
  }

  const clearValidationError = (modelKey) => {
    const errorArr = validationErrors.slice(0);
    const index = errorArr.findIndex(error => error.source === modelKey);

    if (index > -1) {
      errorArr.splice(index, 1);
    }

    return errorArr;
  }

  const elementFields = fields.map((field) => {
    let key = field.key ?  field.key : field.modelKey;

    if (field.keyFunc) {
      key = field.keyFunc(model);
    }

    return (<FormElement
      field={field}
      errors={parsedErrors}
      model={model}
      onFieldChange={onFieldChange}
      key={key}
      removeFromList={removeFromList}
    />);
  });

  let hasRequiredMessage = false;
  let showRequiredMessage = false;
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field.required) {
      hasRequiredMessage = true;
    }
    if (field.showLabel) {
      showRequiredMessage = true
    }
  }

  return (
    <>
      { hasRequiredMessage &&
        <p className={`u-text-left u-font-primary u-margin-left-small ${showRequiredMessage ? '':'u-visually-hidden'}`}>{t('common.requiredFields')}</p>
      }
      {elementFields}
    </>
  );
};

Elements.propTypes = {
  fields: PropTypes.array.isRequired,
  updateField: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  dispatchMethod: PropTypes.func.isRequired,
}

export default Elements;
