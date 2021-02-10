import { connect } from 'react-redux';
import AddTeamMember from './AddTeamMember';
import { uploadTeamMemberAvatar } from '../../redux/modules/teamMembers';

const mapStateToProps = ({ teamMembers, users }) => ({
  uploadTeamMemberAvatarState: teamMembers.uploadTeamMemberAvatar,
  createTeamMemberState: teamMembers.createTeamMember,
  inviteUserState: users.inviteUser
});

const mapDispatchToProps = (dispatch) => {
  return {
    uploadTeamMemberAvatar: (attributes) => {
      dispatch(uploadTeamMemberAvatar(attributes));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(AddTeamMember);
