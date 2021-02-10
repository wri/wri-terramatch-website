import { connect } from 'react-redux';
import AddTeamMember from './AddTeamMember';
import { inviteUser, clearInviteUser } from '../../../redux/modules/users';

const mapStateToProps = ({ users }) => ({
  inviteUserState: users.inviteUser,
});

const mapDispatchToProps = (dispatch) => {
  return {
    inviteUser: (data) => {
      dispatch(inviteUser(data));
    },
    clearInviteUser: () => {
      dispatch(clearInviteUser());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTeamMember);
