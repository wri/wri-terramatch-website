import { connect } from 'react-redux';
import { createUser, clearCreateUser, acceptUserInvite, clearAcceptUserInvite } from '../../redux/modules/users';
import { acceptAdminInvite, clearAcceptAdminInvite } from '../../redux/modules/admin';
import Signup from './Signup';

const mapStateToProps = ({ users, admin }) => ({
  signupState: users.createUser,
  acceptAdminInviteState: admin.acceptAdmin,
  acceptUserInviteState: users.acceptUser
});

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (signUpDetails) => {
      dispatch(createUser(signUpDetails));
    },
    acceptAdminInvite: (signUpDetails) => {
      dispatch(acceptAdminInvite(signUpDetails));
    },
    acceptUserInvite: (signUpDetails) => {
      dispatch(acceptUserInvite(signUpDetails));
    },
    clearSignup: () => {
      dispatch(clearCreateUser());
      dispatch(clearAcceptUserInvite());
      dispatch(clearAcceptAdminInvite());
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Signup);
