import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'tsc-chameleon-component-library';
import Login from '../login/LoginContainer';
import NavBar from '../navigation/NavBarContainer';
import { useTranslation } from 'react-i18next';
import CookieBanner from '../../components/cookieBanner/CookieBanner';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import Routes from '../route/Routes';
import LoadingScreen from '../loading/LoadingScreen';
import NotificationBar from '../notificationBar/NotificationBarContainer';
import { isAdmin, hasOrganisation } from '../../helpers';

const App = (props) => {
  const {
    isLoginModal,
    hideLoginModal,
    setSearchQuery,
    location,
    meState,
    history,
    isLoggedIn,
    jwt,
    logout,
    getMe,
    isNotificationBar,
  } = props;

  const { t } = useTranslation();

  useEffect(() => {
    if (jwt) {
      const expired = jwt.exp;
      if (Date.now() / 1000 > expired) {
        // Log user out.
        logout();
      } else {
        getMe();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // The empty dependency array allows this useEffect to run only once.
  // Because this is App.js it will only run when the page is loaded.
  // The linter seems to be quite strict about it being empty.

  useEffect(() => {
    const validPath = location.pathname !== '/verify' &&
                      location.pathname !== '/createOrganisation';

    if (isLoggedIn && validPath) {
      const me = meState.data;
      if (!me.email_address_verified_at) {
        // Push user to check verify page
        history.push('/verify');
      } else if (!hasOrganisation(me) && me.email_address_verified_at && !isAdmin(me)) {
        // Push user to setup organisation (welcome page)
        history.push('/createOrganisation');
      }
    }

    if (location.search) {
      setSearchQuery(location.search);
    }
  });

  if (meState.isFetching) {
    return (
      <div className="App" data-testid="test-app">
        <LoadingScreen />
      </div>
    )
  }

  return (
    <div className="App" data-testid="test-app">
      <div className="c-navbar--container">
        <NavBar me={meState}/>
      </div>
      <main id="main-content">
        {isNotificationBar && <NotificationBar />}
        <Routes {...props}/>
      </main>
      {isLoginModal && <Modal show close={hideLoginModal}>
        <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-normal">{t('login.pleaseSignIn')}</h2>
        <Login className="u-margin-vertical-small"/>
      </Modal> }
      <CookieBanner />
    </div>
  );
};

App.propTypes = {
  isLoginModal: PropTypes.bool.isRequired,
  hideLoginModal: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  meState: initialAsyncStatePropType.isRequired,
  history: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  jwt: PropTypes.object,
  logout: PropTypes.func.isRequired,
  getMe: PropTypes.func.isRequired,
  isNotificationBar: PropTypes.bool.isRequired
};

App.defaultProps = {
  jwt: null
};

export default App;
