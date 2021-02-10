import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';

const FormCheckboxGroup = (props) => {
  const { data, onChange, value, isGrid, modelName } = props;
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  const [ changeCount, setChangeCount ] = useState(0);

  useEffect(() => {
    onChange({value: selectedOptions, changeCount: changeCount});
  }, [selectedOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (value.length > 0) {
      setSelectedOptions(value);
    }
  }, [value]);

  const valueChange = (value) => {
    const values = [...selectedOptions];
    const index = values.indexOf(value);

    if (index > -1) {
      values.splice(index, 1);
    } else {
      values.push(value);
    }
    // If already in, remove it, else add it.
    setSelectedOptions(values);
    setChangeCount(changeCount + 1);
  };

  const checkboxes = data.map((option) => {
    const labelImage = isGrid ? {backgroundImage: `url('${process.env.PUBLIC_URL}/images/tiles/${modelName}/${option.value}.png')`} : null;
    return (<FormInput key={option.value} type="checkbox"
      label={option.label}
      id={option.value}
      className="u-margin-bottom-small"
      showLabel
      value={selectedOptions.indexOf(option.value) > -1}
      onChange={() => {valueChange(option.value)}}
      labelImage={labelImage}
    />)
  });

  return (
    <div className={`c-form__checkbox-group ${isGrid ? 'c-form__checkbox-group--is-grid' : ''}`}>
      {checkboxes}
    </div>
  );
};

FormCheckboxGroup.propTypes = {
  data: PropTypes.array.isRequired,
  isGrid: PropTypes.bool,
  modelName: PropTypes.string
};

FormCheckboxGroup.defaultProps = {
  isGrid: false,
  modelName: ''
};

export default FormCheckboxGroup;
