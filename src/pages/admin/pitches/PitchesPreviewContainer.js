import { connect } from 'react-redux';
import PitchPreview from './PitchPreview';
import {
  getPitch,
  getPitchVersions,
  getPitchVersion
} from '../../../redux/modules/pitch';
import {
  approvePitchTasks,
  rejectPitchTasks
} from '../../../redux/modules/admin';
import { getPitchDocumentsInspect } from '../../../redux/modules/documentAwards';
import { getCarbonCertificationsInspect } from '../../../redux/modules/carbonCertifications';
import { getMetricsInspect } from '../../../redux/modules/metrics';
import { getTreeSpeciesInspect } from '../../../redux/modules/treeSpecies';

const mapStateToProps = ({ pitch, carbonCertifications, metrics, treeSpecies, documentAwards, admin }) => ({
  pitchVersions: pitch.getPitchVersions,
  pitchVersion: pitch.getPitchVersion,
  carbonCertificationsInspect: carbonCertifications.getCarbonCertificationsInspect,
  metricsInspect: metrics.getMetricsInspect,
  treeSpeciesInspect: treeSpecies.getTreeSpeciesInspect,
  documentsInspect: documentAwards.getPitchDocumentsInspect,
  approveState: admin.approvePitchTasks,
  rejectState: admin.rejectPitchTasks
});

const mapDispatchToProps = dispatch => {
  return {
    getPitch: id => dispatch(getPitch(id)),
    getPitchVersions: id => dispatch(getPitchVersions(id)),
    getPitchVersion: id => dispatch(getPitchVersion(id)),
    approvePitch: approvals => dispatch(approvePitchTasks(approvals)),
    rejectPitch: rejections => dispatch(rejectPitchTasks(rejections)),
    getExtras: (pitchId) => {
      // Documents
      dispatch(getPitchDocumentsInspect(pitchId));
      // Carbon
      dispatch(getCarbonCertificationsInspect(pitchId));
      // Metrics
      dispatch(getMetricsInspect(pitchId));
      // Tree species
      dispatch(getTreeSpeciesInspect(pitchId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PitchPreview);
