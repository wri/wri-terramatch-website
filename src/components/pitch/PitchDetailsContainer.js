import { connect } from 'react-redux'
import PitchDetails from './PitchDetails';
import { uploadPitchVideo } from '../../redux/modules/pitch';

const mapStateToProps = ({ pitch }) => ({
  uploadVideoState: pitch.uploadPitchVideo
});

const mapDispatchToProps = (dispatch) => {
  return {
    uploadVideo: (file) => {
      dispatch(uploadPitchVideo(file));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PitchDetails);
