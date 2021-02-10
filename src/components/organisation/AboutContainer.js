import { connect } from 'react-redux'
import About from './About';
import { uploadOrganisationAvatar, uploadOrganisationCover } from '../../redux/modules/organisation';

const mapStateToProps = ({ organisations }) => ({
  uploadAvatarState: organisations.uploadOrganisationAvatar,
  uploadCoverState: organisations.uploadOrganisationCover
});

const mapDispatchToProps = (dispatch) => {
  return {
    uploadOrganisationAvatar: (file) => {
      dispatch(uploadOrganisationAvatar(file));
    },
    uploadOrganisationCover: (file) => {
      dispatch(uploadOrganisationCover(file));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
