import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';

const FormRadioGroup = (props) => {
  const { data, onChange, value, id } = props;
  const [ activeRadio, setActiveRadio ] = useState(value ? value : null);

  useEffect(() => {
    if (value !== undefined && value !== "") {
      setActiveRadio(value);
    }
  }, [value]);

  const valueChange = (value) => {
    onChange(data.find(option => option.value === value));
    setActiveRadio(value)
  };

  const radioButtons = data.map((option) => {
    return <FormInput key={option.value} type="radio"
      label={option.label}
      id={`${id}-${option.value}`}
      className="u-margin-bottom-small"
      showLabel
      value={activeRadio === option.value}
      onChange={() => {valueChange(option.value)}}
    />
   });

  return (
    <div className="c-form__radio-group">
      {radioButtons}
    </div>
  );
};

FormRadioGroup.propTypes = {
  data: PropTypes.array.isRequired
};

export default FormRadioGroup;
