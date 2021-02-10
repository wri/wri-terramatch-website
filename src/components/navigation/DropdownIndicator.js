import React from 'react';
import { components } from 'react-select';
import dropdownImage from '../../assets/images/icons/arrow-drop-up.svg';

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={dropdownImage} role="presentation" alt="" />
    </components.DropdownIndicator>
  );
};

export default DropdownIndicator;
