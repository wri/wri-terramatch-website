import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import DropdownIndicator from '../navigation/DropdownIndicator';
import { useTranslation } from 'react-i18next';
import FormAsyncSelect from './FormAsyncSelect';
import FormFileUpload from './FormFileUpload';
import FormRadioGroup from './FormRadioGroup';
import FormCheckboxGroup from './FormCheckboxGroup';
import FormAsyncGroup from './FormAsyncGroup';
import FormMapInput from './FormMapInput';
import FormMultiText from './FormMultiText';
import FormMultiUpload from './FormMultiUploadContainer';
import FormUserSelect from './FormUserSelectContainer';
import FormDatePicker from './FormDatePicker';
import TYPES from './FormInputTypes';

const FormInput = (props) => {
  const {
    type,
    label,
    helpLabel,
    helpLink,
    id,
    className,
    showLabel,
    errorText,
    disabled,
    required,
    value,
    placeholder,
    onChange,
    autoComplete,
    asyncValue,
    asyncLabel,
    resource,
    responseIsString,
    data,
    accept,
    busy,
    success,
    uploadMessage,
    fileName,
    errors,
    shouldSplitError,
    isSquare,
    translate,
    onKeyDown,
    min,
    max,
    step,
    labelImage,
    isHtmlLabel,
    hidden,
    isClearable,
    filterData,
    maxLength,
    sortAlphabetical
  } = props;

  const { t } = useTranslation();

  const hasError = errorText.length > 0 || errors.length > 0;

  let inputElement = null;
  let inputId = `${id}-${type}-input`;
  let errorId = `${inputId}-error`;
  let helpId = `${inputId}-help`;

  let containerClasses = hidden ? 'u-display-hidden' : `c-form__group ${className}`;
  let labelClasses = showLabel ? 'u-text-left u-text-uppercase u-text-bold u-text-black' : 'u-visually-hidden';
  let inputClasses = 'c-form__input';
  let errorClasses = 'c-form__error-message';

  if (hasError) {
    inputClasses += ' c-form__input--has-error';
  }

  let isRadioCheckbox = false;

  const selectOptions = data.map(item => {
    return {
      label: t(item.label),
      value: item.value
    }
  })

  switch (type) {
    case TYPES.text:
    case TYPES.password:
    case TYPES.email:
    case TYPES.textarea:
    case TYPES.tel:
    case TYPES.number:
    case TYPES.url:
      const isTextArea = type === TYPES.textarea;
      const Element = isTextArea ? 'textarea' : 'input';

      inputElement = (
        <Element
          id={inputId}
          type={!isTextArea ? type : null}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helpId}
          disabled={disabled}
          required={required}
          value={value !== null && value !== undefined ? value : ''}
          onChange={onChange}
          placeholder={placeholder}
          data-testid="input-element"
          autoComplete={autoComplete}
          accept={accept}
          onKeyDown={onKeyDown}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
        />
      );

      if (isTextArea) {
        labelClasses += ' c-form__label';
      };

      break;
    case TYPES.date:
      inputElement = <FormDatePicker {...props} />
        break;
    case TYPES.file:
      inputElement = <FormFileUpload
        onChange={onChange}
        inputClasses={`${inputClasses} u-visually-hidden`}
        inputId={inputId}
        hasError={hasError}
        errorId={errorId}
        helpId={helpId}
        busy={busy}
        success={success}
        required={required}
        accept={accept}
        disabled={disabled}
        uploadMessage={uploadMessage}
        fileName={fileName}
        isSquare={isSquare}
        value={value}
      />;
      break;
    case TYPES.multiUpload:
      inputElement = (
        <FormMultiUpload {...props} />
      );
      break;
    case TYPES.toggle:
      containerClasses += ` u-flex u-flex--row
        u-flex--space-between
        u-flex--centered
        u-border-separator
        u-padding-vertical-tiny`;

      inputElement = (
        <button
          id={inputId}
          className="c-form__toggle-button"
          type="button"
          data-action="aria-switch"
          aria-checked={value}
          role="switch"
          onClick={onChange}
          data-testid="toggle-element">
          <span></span>
        </button>
      );
      break;
    case TYPES.radio:
    case TYPES.checkbox:
      isRadioCheckbox = true;
      labelClasses += ` c-form__${type}-label u-flex u-flex--row u-flex--space-between u-flex--centered u-width-100`;
      labelClasses = labelClasses.replace('u-text-bold', '');
      containerClasses += ` u-padding-vertical-tiny`;
      inputElement = (
        <input
          id={inputId}
          type={type}
          className={`c-form__${type}-input u-visually-hidden`}
          checked={value}
          onChange={onChange}
          data-testid="radio-checkbox-element"
          required={required}
        />
      );
      break;
    case TYPES.radioGroup:
      if (props.resource) {
        inputElement = (
          <FormAsyncGroup {...props}/>
        );
      } else {
        inputElement = (
          <FormRadioGroup {...props}/>
        );
      }
      break;
    case TYPES.checkboxGroup:
      if (props.resource) {
        inputElement = (
          <FormAsyncGroup {...props}/>
        );
      } else {
        inputElement = (
          <FormCheckboxGroup {...props}/>
        );
      }
      break;
    case TYPES.asyncSelect:
        inputElement = <FormAsyncSelect
          asyncValue={asyncValue}
          asyncLabel={asyncLabel}
          responseIsString={responseIsString}
          resource={resource}
          onChange={onChange}
          required={required}
          disabled={disabled}
          value={value}
          translate={translate}
          isClearable={isClearable}
          filterData={filterData}
          sortAlphabetical={sortAlphabetical} />;
        break;
    case TYPES.select:
        // The extra input fixes an issue with react-select
        // https://github.com/JedWatson/react-select/issues/3140
        inputElement = (
        <>
          <Select
            options={selectOptions}
            defaultOptions
            onChange={onChange}
            classNamePrefix="c-select"
            components={{ DropdownIndicator }}
            disabled={disabled}
            value={selectOptions.find(option => option.value === value)}
            isClearable={isClearable}
          />
          {!disabled && (
            <input
              tabIndex={-1}
              autoComplete="off"
              className="c-form__hidden-input"
              value={value}
              required={required}
              onChange={() => {}}
            />
          )}
        </>);
        break;
      case TYPES.map:
        errorClasses += ' u-padding-left-small u-margin-right-small';
        labelClasses += ' u-padding-left-small';
        inputElement = (
          <FormMapInput {...props} />
        );
        break;
    case TYPES.multiText:
      inputElement = (
        <FormMultiText {...props} />
      );
      break;
    case TYPES.userSelect:
      inputElement = (
        <FormUserSelect {...props} />
      );
      break;
    default:
        inputElement = null;
  }

  const errorMessageElement = errorText.length > 0 ? (
    <span className="c-form__error-message" id={errorId} role="alert">{errorText}</span>
  ) : null;

  const errorElements = errors.length > 0 ? errors.map((error, i) => {
    let errorSource = error.source;
    if (shouldSplitError) {
      errorSource = error.source.split('-')[1];
    }
    return <li key={error.code}>{ t(`errors.${errorSource}.${error.code}`, {...error.variables}) }</li>
  }) : null


  const labelElement = (
    <>
      <label htmlFor={inputId}
        className={labelClasses}
        tabIndex={type === TYPES.radio ? "0" : "-1"}>
        {labelImage && <div style={labelImage} className="c-label-image"/>}
        <span>
          {isHtmlLabel ? <span dangerouslySetInnerHTML={{__html: label}} /> : label } {required &&
            <sup>*</sup>
          }
        </span>
      </label>
      {helpLabel && <p id={helpId} className="u-text-left u-font-primary u-margin-top-none">{helpLabel}</p> }
    </>
  );

  return (
    <div className={containerClasses}>
      {isRadioCheckbox ? (
        <>
          {inputElement}
          {labelElement}
          {helpLink && <a href={helpLink} className="u-link u-text-left" target="_blank" rel="noopener noreferrer">{helpLink}</a>}
        </>
      ) : (
        <>
          {labelElement}
          {helpLink && <a href={helpLink} className="u-link u-text-left" target="_blank" rel="noopener noreferrer">{helpLink}</a>}
          {inputElement}
        </>
      )}
      { errors.length > 0 && <ul className={errorClasses} id={errorId} role="alert">
        {errorElements}
      </ul> }
      {errorMessageElement}
    </div>
  );
};

FormInput.propTypes = {
  type: PropTypes.oneOf(Object.keys(TYPES).map(key => TYPES[key])),
  label: PropTypes.string.isRequired,
  helpLabel: PropTypes.string,
  helpLink: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  className: PropTypes.string,
  showLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  errorText: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.array, PropTypes.object]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  autoComplete: PropTypes.string,
  asyncValue: PropTypes.string,
  asyncLabel: PropTypes.string,
  responseIsString: PropTypes.bool,
  data: PropTypes.array,
  accept: PropTypes.string,
  busy: PropTypes.bool,
  success: PropTypes.bool,
  uploadMessage: PropTypes.string,
  fileName: PropTypes.string,
  errors: PropTypes.array,
  translate: PropTypes.bool,
  onKeyDown: PropTypes.func,
  min:  PropTypes.string,
  max: PropTypes.string,
  step: PropTypes.string,
  labelImage: PropTypes.object,
  isHtmlLabel: PropTypes.bool,
  hidden: PropTypes.bool,
  isClearable: PropTypes.bool,
  sortAlphabetical: PropTypes.bool
};

FormInput.defaultProps = {
  type: TYPES.text,
  showLabel: false,
  helpLabel: '',
  helpLink: '',
  errorText: '',
  required: false,
  disabled: false,
  value: '',
  placeholder: '',
  className: '',
  onChange: () => {},
  autoComplete: '',
  asyncValue: 'value',
  asyncLabel: 'label',
  responseIsString: false,
  data: [],
  accept: '',
  busy: false,
  success: false,
  uploadMessage: 'common.upload',
  fileName: '',
  errors: [],
  translate: false,
  onKeyDown: () => {},
  min: '',
  max: '',
  step: '',
  labelImage: null,
  isHtmlLabel: false,
  hidden: false,
  isClearable: false,
  sortAlphabetical: false
};

export default FormInput;
