import React from 'react';
import PropTypes from 'prop-types';

const TabHeader = (props) => {
  const {
    active, id, title, titleClick,
  } = props;

  const isActive = active === true ? 'is-active' : '';

  return (
    <li role="presentation" className={`u-small-border u-border-curved u-margin-right-small c-tab__item ${isActive} u-d-inline`}>
      <button className="c-tab__btn u-padding-small" type="button" id={`${id}-tab`} href={`#${id}`} role="tab" aria-controls={id} aria-selected="true" onClick={titleClick}>{title}</button>
    </li>
  );
};

TabHeader.propTypes = {
  active: PropTypes.bool,
  id: PropTypes.string,
  title: PropTypes.string,
  titleClick: PropTypes.func,
};

TabHeader.defaultProps = {
  active: false,
  id: '',
  title: '',
  titleClick: () => {},
};

export default TabHeader;
