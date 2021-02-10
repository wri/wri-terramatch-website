import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';
import { Button } from 'tsc-chameleon-component-library';
import { useTranslation } from 'react-i18next';

const FormMultiText = (props) => {
  const { onChange, value, label, id } = props;
  const [ values, setValues ] = useState(value ? value : []);
  const { t } = useTranslation();

  const valueChange = (value, index) => {
    const newValues = [...values];

    newValues[index] = value;
    // If already in, remove it, else add it.
    setValues(newValues);
    onChange({value: newValues});
  };

  const addValue = () => {
    values.push('');
    setValues(values);
    onChange({value: values});
  };

  const removeValue = (index) => {
    values.splice(index, 1);
    setValues(values);
    onChange({value: values});
  };

  const inputs = values.map((option, index) => {
    return (
      <div key={index} className="u-flex">
        <FormInput type="text"
          label={`${label} ${index}`}
          id={`${id}-${index}`}
          className="u-margin-bottom-small u-flex--grow"
          value={option}
          onChange={(e) => {valueChange(e.target.value, index)}}
        />
        <Button
          className="c-button--small u-margin-tiny"
          click={() => removeValue(index)}
          variant="secondary">{t('common.remove')}</Button>
      </div>
    );
   });

  return (
    <div className={`c-form__multi-text`}>
      {inputs}
      <Button
        className="c-button--small u-margin-tiny"
        click={addValue}
        variant="outline">{t('common.add')}</Button>
    </div>
  );
};

FormMultiText.propTypes = {
  data: PropTypes.array.isRequired,
};

export default FormMultiText;
