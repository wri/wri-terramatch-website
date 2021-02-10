import { connect } from 'react-redux';
import CarbonCertification from './MethodMetric';
import { getMetrics,
    getMetricsInspect,
    clearGetMetrics,
    clearGetMetricsInspect,
    deleteMetric,
    clearDeleteMetric,
    patchMetrics,
    clearPatchMetrics
  } from '../../redux/modules/metrics';

import { patchPitch, clearPatchPitch } from '../../redux/modules/pitch';
import { setMetrics, updateMetric } from '../../redux/modules/editPitch';

const mapStateToProps = ({ metrics, auth, editPitch, pitch }) => ({
    metricsState: metrics.getMetrics,
    metricsInspectState: metrics.getMetricsInspect,
    updateMetricsState: metrics.patchMetrics,
    deleteMetricState: metrics.deleteMetric,
    metricsEditState: editPitch.restorationMetrics,
    patchMetricsState: metrics.patchMetrics,
    meState: auth.me,
    updatePitchState: pitch.patchPitch
});

const mapDispatchToProps = (dispatch) => {
    return {
        getMetrics: (pitchId) => {
            dispatch(getMetrics(pitchId))
        },
        getMetricsInspect: (pitchId) => {
            dispatch(getMetricsInspect(pitchId));
        },
        setMetricsEdit: (metrics) => {
            dispatch(setMetrics(metrics));
        },
        updateMetricEdit: (newMetric) => {
            dispatch(updateMetric(newMetric));
        },
        updatePitch: (pitch) => dispatch(patchPitch(pitch)),
        clearDeleteMetric: () => {
            dispatch(clearDeleteMetric());
        },
        clearPatchMetrics: () => {
            dispatch(clearPatchMetrics());
        },
        patchMetrics: (metrics) => {
          dispatch(patchMetrics(metrics))
        },
        deleteMetric: (metricId) => {
            dispatch(deleteMetric(metricId));
        },
        clearState: () => {
            dispatch(clearGetMetrics());
            dispatch(clearGetMetricsInspect());
            dispatch(clearPatchPitch());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarbonCertification);
