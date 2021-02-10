import { connect } from 'react-redux'
import Pitch from './Pitch';
import { getPitchVersions, clearGetPitchVersions, getPitch, clearGetPitch } from '../../redux/modules/pitch';
import { showNotificationBar, closeNotificationBar } from '../../redux/modules/app';

const mapStateToProps = ({ auth, pitch }) => ({
  meState: auth.me,
  getPitchVersionsState: pitch.getPitchVersions,
  getPitchState: pitch.getPitch
});

const mapDispatchToProps = (dispatch) => {
  return {
    getPitchVersions: (id) => {
      dispatch(getPitchVersions(id));
    },
    getPitch: (id) => {
      dispatch(getPitch(id));
    },
    showNotificationBar: (message, title, messageParams) => {
      dispatch(showNotificationBar(message, title, messageParams));
    },
    closeNotificationBar: () => {
      dispatch(closeNotificationBar());
    },
    clearState: () => {
      dispatch(clearGetPitchVersions());
      dispatch(clearGetPitch());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pitch);
