import { connect } from 'react-redux';
import { logout, clearAuth } from '../../redux/modules/auth';
import { getOrganisationVersionsNavBar, clearGetOrganisationVersionsNavBar } from '../../redux/modules/organisation';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar';

const getHasNotifications = (notifcationState) => {
  if (!notifcationState.data) {
    return false;
  }
  const index = notifcationState.data.findIndex((notifiction) => notifiction.unread === true);

  return index > -1;
};

const mapStateToProps = ({ auth, notifications, organisations }) => ({
  isLoggedIn: auth.jwt && auth.me.data,
  hasNotifications: getHasNotifications(notifications.getNotifications),
  organisationVersions: organisations.getOrganisationVersionsNavBar
});

const mapDispatchToProps = (dispatch) => {
  return {
    getOrganisationVersions: (id) => dispatch(getOrganisationVersionsNavBar(id)),
    clearOrganisationVersions: () => dispatch(clearGetOrganisationVersionsNavBar()),
    logout: () => {
      dispatch(logout());
      dispatch(clearAuth());
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
