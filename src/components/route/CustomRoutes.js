import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { showLoginModal } from '../../redux/modules/app';
import { logout, clearAuth } from '../../redux/modules/auth';

const LoggedOut = ({ component: Component, ...rest }) => {
  const { jwt, me, doLogout } = rest;

  const isLoggedIn = jwt && me.data;

  useEffect(() => {
    if (isLoggedIn) {
      doLogout();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoggedIn) {
    return null
  };

  return (
      <Route {...rest} render={props => (
          isLoggedIn
            ? null
            : <Component {...props} />
      )} />
  );
};

/**
 * This is a PrivateRoute component, used to redirect the user when the user is not authenticated
 */
const Private = ({ component: Component, children: Child, ...rest }) => {
  let isAuth = false;
  const { jwt, showLogin, adminRoute, me } = rest;

  if (jwt && jwt.exp) {
    const currentTime = Math.floor(Date.now()/1000);
    if (currentTime < jwt.exp) {
      isAuth = true;
    }
  }

  if (!isAuth || !me.data) {
    showLogin(rest.location.pathname);
  }

  if (adminRoute && me.data && me.data.role !== 'admin') {
    return <Redirect to="/" />
  }

  return (
      <Route {...rest} render={props => (
          isAuth
            ? (Component && <Component {...props} />)
              || (Child && <Child {...props}/>)
            : <Redirect to={
                {
                  pathname: '/',
                  search: props.location.search,
                  state: { from: props.location }
                }
              } />
      )} />
  );
};

const mapStateToProps = ({ auth, app }) => ({
  jwt: auth.jwt,
  me: auth.me,
  searchQuery: app.searchQuery
});

const mapDispatchToProps = (dispatch) => ({
  showLogin: (redirect) => {
    dispatch(showLoginModal(redirect))
  },
  doLogout: () => {
    dispatch(logout());
    dispatch(clearAuth());
  }
})


export const PrivateRoute = connect(mapStateToProps, mapDispatchToProps)(Private);
export const LoggedOutRoute = connect(mapStateToProps, mapDispatchToProps)(LoggedOut);
