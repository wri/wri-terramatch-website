import React from 'react';
import PropTypes from 'prop-types';

const PanelItem = (props) => {
  const { children, className } = props;

  return (
    <div className={`c-panel-item
      u-background-white ${className}`}>
      {children}
    </div>
  )
}

PanelItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  className: PropTypes.string
};

PanelItem.defaultProps = {
  className: ''
}

export default PanelItem;
