import { connect } from 'react-redux'
import TeamMembers from './TeamMembers';
import { removeTeamMember,
         clearRemoveTeamMember,
         patchTeamMember,
         clearPatchTeamMember } from '../../redux/modules/teamMembers';
import { patchUser,
         clearPatchUser } from '../../redux/modules/users';
import { upload, clearUpload } from '../../redux/modules/upload';

const mapStateToProps = ({ teamMembers, users, upload }) => ({
  removeTeamMemberState: teamMembers.removeTeamMember,
  patchTeamMemberState: teamMembers.patchTeamMember,
  patchUserState: users.patchUser,
  uploadAvatarState: upload.upload
});

const mapDispatchToProps = (dispatch) => {
  return {
    removeTeamMember: (id) => {
      dispatch(removeTeamMember(id));
    },
    clearRemoveTeamMember: () => {
      dispatch(clearRemoveTeamMember());
    },
    clearPatches: () => {
      dispatch(clearPatchUser());
      dispatch(clearPatchTeamMember());
    },
    patchUser: (user, uploadAvatarState) => {
      dispatch(patchUser(user, user.id, uploadAvatarState));
    },
    patchTeamMember: (user, uploadAvatarState) => {
      dispatch(patchTeamMember(user, user.id, uploadAvatarState));
    },
    uploadAvatar: (attributes) => {
      dispatch(upload(attributes));
    },
    clearUpload: () => {
      dispatch(clearUpload());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMembers);
