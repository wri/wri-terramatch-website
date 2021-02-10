import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import DropdownIndicator from '../navigation/DropdownIndicator';
import superagent from 'superagent';
import { useTranslation } from 'react-i18next';

const FormAsyncSelect = (props) => {
  const { asyncValue,
    asyncLabel,
    translate,
    responseIsString,
    resource,
    onChange,
    value,
    required,
    disabled,
    isClearable,
    filterData,
    sortAlphabetical
  } = props;

  const [asyncSelectValues, setAsyncSelectValues] = useState([]);
  const [langChangeSet, setLangChangeSet] = useState(false);
  const [asyncKey, setAsyncKey] = useState(Date.now());

  const { t, i18n } = useTranslation();

  if (!langChangeSet) {
    i18n.on('languageChanged', () => {
      setAsyncSelectValues([])
    });
    setLangChangeSet(true);
  }

  useEffect(() => {
    // Force change and reload on async select.
    setAsyncKey(Date.now());
  }, [asyncSelectValues, setAsyncKey])

  const loadAsyncOptions = (inputValue, callback) => {
    if (asyncSelectValues.length === 0) {
      superagent.get(`${process.env.REACT_APP_API_URL}${resource}`)
      .then(res => {
        let { data } = res.body;
        if (filterData) {
          data = data.filter(filterData);
        }
        const mapped = data.map(item => {
          if (responseIsString) {
            return {
              value: item,
              label: item
            };
          }
          return {
            value: item[asyncValue],
            label: translate ? t(`${asyncLabel}.${item[asyncValue]}`) : item[asyncLabel]
          };
        }).sort((a, b) => {
          if (sortAlphabetical) {
            return a.label.localeCompare(b.label, i18n.language);
          }
          // names must be equal or not alphabetical
          return 0;
        });

        setAsyncSelectValues(mapped);
        callback(filterOptions(mapped, inputValue));
      });
    } else {
      callback(filterOptions(asyncSelectValues, inputValue));
    }
  };

  const filterOptions = (options, inputValue) => {
    // Filter and return
    return options.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  };

  // The extra input fixes an issue with react-select
  // https://github.com/JedWatson/react-select/issues/3140
  return (
    <>
    <AsyncSelect
      {...props}
      cacheOptions
      loadOptions={loadAsyncOptions}
      defaultOptions
      onChange={onChange}
      isClearable={isClearable}
      classNamePrefix="c-select"
      components={{ DropdownIndicator }}
      value={asyncSelectValues.find(option => option.value === value)}
      key={JSON.stringify(asyncKey)}
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
    </>
  )
}

FormAsyncSelect.propTypes = {
  asyncValue: PropTypes.string,
  asyncLabel: PropTypes.string,
  responseIsString: PropTypes.bool,
  resource: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  isClearable: PropTypes.bool
}

FormAsyncSelect.defaultProps = {
  asyncValue: 'value',
  asyncLabel: 'label',
  responseIsString: false,
  onChange: () => {},
  value: '',
  required: false,
  disabled: false,
  isClearable: false
}

export default FormAsyncSelect;
