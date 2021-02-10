import { connect } from 'react-redux';
import AddRestorationMetrics from './AddRestorationMetrics';
import { createMetrics, clearCreateMetrics, patchMetrics, clearPatchMetrics } from '../../redux/modules/metrics';

const mapStateToProps = ({ metrics, editPitch }) => ({
    createMetricsState: metrics.createMetrics,
    metricsEditState: editPitch.restorationMetrics,
    updateMetricsState: metrics.patchMetrics
});

const mapDispatchToProps = (dispatch) => {
    return {
        createMetrics: (metricsArray, pitchId) => {
            dispatch(createMetrics(metricsArray, pitchId));
        },
        clearCreateMetrics: () => {
            dispatch(clearCreateMetrics());
        },
        updateMetrics: (metrics) => {
            dispatch(patchMetrics(metrics));
        },
        clearUpdateMetrics: () => {
            dispatch(clearPatchMetrics());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRestorationMetrics);
