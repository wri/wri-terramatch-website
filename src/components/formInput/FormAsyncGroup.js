import React, { useState } from 'react';
import FORM_TYPES from './FormInputTypes';
import superagent from 'superagent';
import FormCheckboxGroup from './FormCheckboxGroup';
import FormRadioGroup from './FormRadioGroup';
import { useTranslation } from 'react-i18next';

const FormAsyncGroup = (props) => {
  const { resource, asyncLabel, asyncValue, responseIsString, translate } = props;
  const [ asyncSelectValues, setAsyncSelectValues ] = useState([]);
  const [ fetching, setIsFetching ] = useState(false);
  const [ hasFetched, setHasFetched ] = useState(false);
  const [ langChangeSet, setLangChangeSet ] = useState(false);
  const [ offlineError, setOfflineError ] = useState(false);

  const { t, i18n } = useTranslation();

  if (!langChangeSet) {
    i18n.on('languageChanged', () => {
      loadAsyncOptions();
    });
    setLangChangeSet(true);
  }

  const loadAsyncOptions = () => {
    setIsFetching(true);

    if (asyncSelectValues.length === 0) {
      superagent.get(`${process.env.REACT_APP_API_URL}${resource}`)
      .then(res => {
        setIsFetching(false);
        setHasFetched(true);

        const { data } = res.body;
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
        });

        setAsyncSelectValues(mapped);
      })
      .catch(err => {
        if (err.message.startsWith('Request has been terminated')) {
          setOfflineError(true);
        }
      });
    }
  }

  if (!fetching && !hasFetched) {
    loadAsyncOptions();
  }

  if (offlineError) {
    return <p>{t('common.noInternet')}</p>
  }
  if (fetching) {
    return <p>{t('common.loadingOptions')}</p>
  }

  return props.type === FORM_TYPES.radioGroup ?
  <FormRadioGroup {...props} data={asyncSelectValues} /> :
  <FormCheckboxGroup {...props} data={asyncSelectValues} />
}

export default FormAsyncGroup;
