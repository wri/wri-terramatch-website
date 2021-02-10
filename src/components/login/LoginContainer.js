import { connect } from 'react-redux';
import { login, getMe, requestPasswordReset } from '../../redux/modules/auth';
import { hideLoginModal } from '../../redux/modules/app';
import { withRouter } from 'react-router-dom';
import Login from './Login';

const mapStateToProps = ({ app, auth, users }) => ({
  loginState: auth.login,
  loginRedirect: app.loginRedirect,
  requestResetState: auth.requestPasswordReset,
  meState: auth.me
});

const mapDispatchToProps = (dispatch) => {
  return {
    login: async (loginDetails) => {
      await dispatch(login(loginDetails));
    },
    hideLoginModal: () => {
      dispatch(hideLoginModal());
    },
    requestReset: (loginDetails) => dispatch(requestPasswordReset(loginDetails)),
    getMe: async () => {
      await dispatch(getMe());
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
