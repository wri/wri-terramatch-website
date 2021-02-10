import React from 'react';
import PropTypes from 'prop-types';
import { NavBarItem } from 'tsc-chameleon-component-library';
import { NavLink } from 'react-router-dom';

const NavBarList = (props) => {
  const { items, onClick, hasOrganisation, isAdmin, isOrganisationApproved } = props;

  return items
    .map(item => {
      if (!isOrganisationApproved && item.approvedOrganisationLink) {
        return null;
      }

      if (!hasOrganisation && item.organisationRequired) {
        return null;
      }

      if (!isAdmin && item.adminRequired) {
        return null;
      }

      if (isAdmin && item.hideForAdmin) {
        return null;
      }

    return (
      <NavBarItem className="c-navbar__right-item" key={item.link}>
        <NavLink
          exact={item.exact}
          className={`u-link c-navbar__link u-text-uppercase ${item.hasNotificationDot ? 'u-link--has-notification-dot' : ''}`}
          to={item.link}
          onClick={onClick}>
            {item.name}
          </NavLink>
      </NavBarItem>
    );
  });
}

NavBarList.propTypes = {
  list: PropTypes.array,
  onClick: PropTypes.func,
  hasOrganisation: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

NavBarList.defaultProps = {
  list: [],
  onClick: () => {}
};

export default NavBarList;
