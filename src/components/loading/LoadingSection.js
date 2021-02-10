import React from 'react';
import { Loader } from 'tsc-chameleon-component-library';

export default (props) => {
  const { className } = props;
  return (
    <div className={`u-flex u-flex--centered u-flex--justify-centered ${className}`}>
        <Loader />
    </div>
  );
};
