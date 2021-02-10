import { connect } from 'react-redux';
import { hideLoginModal, setSearchQuery } from '../../redux/modules/app';
import { withRouter } from 'react-router-dom';
import { withTracker } from '../../hoc/withTracker';
import App from './App';
import { logout, clearAuth } from '../../redux/modules/auth';
import { getMe } from '../../redux/modules/auth';

const mapStateToProps = ({ app, auth }) => ({
  isLoginModal: app.isLoginModal,
  meState: auth.me,
  isLoggedIn: auth.jwt !== null && auth.me.data !== null,
  jwt: auth.jwt,
  isNotificationBar: app.notificationBar.visible
});

const mapDispatchToProps = (dispatch) => {
  return {
    hideLoginModal: () => {
      dispatch(hideLoginModal());
    },
    setSearchQuery: (query) => {
      dispatch(setSearchQuery(query));
    },
    logout: () => {
      dispatch(logout());
      dispatch(clearAuth());
    },
    getMe: async () => {
      await dispatch(getMe());
    }
  };
};

export default withRouter(withTracker(connect(mapStateToProps, mapDispatchToProps)(App)));
