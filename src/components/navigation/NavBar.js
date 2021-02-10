import React, { useState, useEffect, useRef } from 'react';
import { NavBar, NavBarItem, Dropdown, Button } from 'tsc-chameleon-component-library';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import DropdownIndicator from './DropdownIndicator';
import Login from '../login/LoginContainer';
import PropTypes from 'prop-types';
import NavBarList from './NavBarList';
import { isAdmin, hasOrganisation, getVersionByState } from '../../helpers';

const NavigationBar = (props) => {
  const { t, i18n } = useTranslation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOrganisationApproved, setOrganisationApproved] = useState(false);
  const { isLoggedIn,
          logout,
          history,
          me,
          hasNotifications,
          organisationVersions,
          getOrganisationVersions,
          clearOrganisationVersions } = props;
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Update the document title using the browser API
    document.documentElement.style.overflow = isNavOpen ? 'hidden' : 'auto';
  }, [isNavOpen]);


  useEffect(() => {
    let id = null;
    if (!id && !me.isFetching && me.data && me.data.organisation_id) {
      id = me.data.organisation_id;
    }

    if (me.data &&
        !isAdmin(me.data) &&
        !organisationVersions.isFetching &&
        !organisationVersions.data &&
        !organisationVersions.error &&
        me.data.organisation_id) {
      getOrganisationVersions(id);
    }

    if (organisationVersions && organisationVersions.data) {
      const version = getVersionByState(organisationVersions, 'approved');
      if (version) {
        setOrganisationApproved(version.status === 'approved');
      }
    }
  }, [getOrganisationVersions, me, organisationVersions]);

  // Detect if user clicks outside of dropdown
  const handleClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    clearOrganisationVersions();
    return () => {
      document.removeEventListener('mousedown', handleClick);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const langOptions = [
    { value: 'en-US', label: t('languages.en-US') },
    { value: 'es', label: t('languages.es-MX') },
    { value: 'fr', label: t('languages.fr')},
    { value: 'pt-BR', label: t('languages.pt-BR')}
  ];

  let currentLanguage = langOptions.find(option => option.value === i18n.language);

  if (!currentLanguage) {
    currentLanguage = langOptions[0];
  }

  const onLangChange = (data) => {
    const { value } = data;
    i18n.changeLanguage(value);
  };

  const setNavOpen = (isOpen) => {
    setIsNavOpen(isOpen);
  };

  const onLogin = () => {
    setIsDropdownOpen(false);
  };

  const logoutClick = () => {
    window.scrollTo(0, 0);
    logout();
    clearOrganisationVersions();
    history.push('/');
  }

  const signedInNavBarItems = [
    {
      name: t('home.title'),
      link: '/',
      exact: true
    },
    {
      name: t('funding.title'),
      link: '/funding',
      organisationRequired: true,
      approvedOrganisationLink: true,
    },
    {
      name: t('projects.title'),
      link: '/projects',
      organisationRequired: true,
      approvedOrganisationLink: true,
    },
    {
      name: t('connections.title'),
      link: '/connections',
      organisationRequired: true,
      approvedOrganisationLink: true,
    },
    {
      name: t('profile.title'),
      link: '/profile',
      organisationRequired: true,
    },
    {
      name: t('notifications.title'),
      link: '/notifications',
      hasNotificationDot: hasNotifications,
      hideForAdmin: true
    },
    {
      name: t('admin.title'),
      link: '/admin',
      adminRequired: true
    }
  ];

  return (
    <>
    <div className="c-navbar__skip-link">
      <a className="u-text-uppercase u-link c-navbar__link " href="#main-content">{t('common.skip-nav')}</a>
    </div>
    <NavBar isOpen={isNavOpen} onOpenChange={setNavOpen}>
      <NavBarItem className="c-navbar__logo-container">
        <Link to="/" onClick={() => { setIsNavOpen(false) }}>
          <div role="img" className="c-navbar__logo" aria-label="WRI logo" />
        </Link>
        <span className="c-navbar__logo-beta u-text-uppercase">{ t('common.beta') }</span>
      </NavBarItem>
      <NavBarItem isRightAligned>
        {isLoggedIn ? (
        <>
          <NavBarList
            items={signedInNavBarItems}
            onClick={() => { setIsNavOpen(false) }}
            isAdmin={me.data ? isAdmin(me.data) : false}
            isOrganisationApproved={isOrganisationApproved}
            hasOrganisation={me.data ? hasOrganisation(me.data) : false}/>
          <NavBarItem className="c-navbar__right-item">
            <Button className="c-navbar__link c-navbar__button u-padding-none" variant="link" click={logoutClick}>{t('login.logout')}</Button>
          </NavBarItem>
        </>
        ):
        <NavBarItem className="c-navbar__right-item c-navbar__login">
          <div ref={dropdownRef}>
            <Dropdown
            buttonText={t('login.login')}
            isOpen={isDropdownOpen}
            onChange={value => { setIsDropdownOpen(value); }}
            >
              <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-normal">{t('login.login')}</h2>
              <Login onLogin={onLogin}/>
            </Dropdown>
          </div>
        </NavBarItem>
        }
        <NavBarItem className="c-language-picker c-navbar__right-item">
          <Select
            options={langOptions}
            onChange={onLangChange}
            value={currentLanguage}
            classNamePrefix="c-language-picker"
            isSearchable={false}
            components={{ DropdownIndicator }}
          />
        </NavBarItem>
      </NavBarItem>
    </NavBar>
    </>
  );
};

NavBar.propTypes = {
  isLoggedIn: PropTypes.bool,
  logout: PropTypes.func,
  me: PropTypes.object,
  hasNotifications: PropTypes.bool
};

NavBar.defaultProps = {
  isLoggedIn: false,
  logout: () => {},
  me: {},
  hasNotifications: false
};

export default NavigationBar;
