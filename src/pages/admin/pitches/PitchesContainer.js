import { connect } from 'react-redux';
import Pitches from './Pitches';
import { getPitchTasks, clearGetPitchTasks, clearRejectPitchTasks, clearApprovePitchTasks } from '../../../redux/modules/admin';
import { clearPitchVersions, clearPitchVersion } from '../../../redux/modules/pitch';
import { clearGetOrganisation } from '../../../redux/modules/organisation';

const mapStateToProps = ({ admin }) => ({
  pitchTasksState: admin.getPitchTasks
});

const mapDispatchToProps = dispatch => {
  return {
    getPitchTasks: () => dispatch(getPitchTasks()),
    clearGetPitchTasks: () => dispatch(clearGetPitchTasks()),
    clearPitch: () => {
      dispatch(clearPitchVersions());
      dispatch(clearPitchVersion());
      dispatch(clearGetOrganisation());
      dispatch(clearRejectPitchTasks());
      dispatch(clearApprovePitchTasks());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pitches);
