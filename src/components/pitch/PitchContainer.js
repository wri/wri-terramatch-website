import { connect } from 'react-redux';
import Pitch from './Pitch';
import { getOrganisation, clearGetOrganisation } from '../../redux/modules/organisation';
import { patchPitch, clearPatchPitch, clearUploadPitchVideo, clearGetPitchVersions } from '../../redux/modules/pitch';
import { patchCarbonCertificates, clearPatchCarbonCertificates } from '../../redux/modules/carbonCertifications';
import { patchMetrics, clearPatchMetrics } from '../../redux/modules/metrics';
import { patchTreeSpecies, clearPatchTreeSpecies } from '../../redux/modules/treeSpecies';

const mapStateToProps = ({
    pitch,
    organisations,
    metrics,
    treeSpecies,
    carbonCertifications,
    auth,
    editPitch
}) => ({
    updatePitchState: pitch.patchPitch,
    updateMetricsState: metrics.patchMetrics,
    updateTreeSpeciesState: treeSpecies.patchTreeSpecies,
    updateCarbonCertificatesState: carbonCertifications.patchCarbonCertificates,
    organisationState: organisations.getOrganisation,
    carbonCertsEditState: editPitch.carbonCertificates,
    treeSpeciesEditState: editPitch.treeSpecies,
    metricsEditState: editPitch.restorationMetrics,
    me: auth.me,
    myOrganisationState: organisations.getOrganisationVersionsNavBar
});

const mapDispatchToProps = (dispatch) => {
    return {
        getOrganisation: (organisationId) => {
            dispatch(getOrganisation(organisationId));
        },
        updatePitch: (pitch) => dispatch(patchPitch(pitch)),
        updateMetrics: (metricsArray) => dispatch(patchMetrics(metricsArray)),
        updateTreeSpecies: (treesArray) => dispatch(patchTreeSpecies(treesArray)),
        updateCarbonCertificates: (carbonArray) => dispatch(patchCarbonCertificates(carbonArray)),
        clearGetOrganisation: () => dispatch(clearGetOrganisation()),
        clearUpdateState: () => {
          dispatch(clearPatchPitch());
          dispatch(clearPatchCarbonCertificates());
          dispatch(clearPatchMetrics());
          dispatch(clearPatchTreeSpecies());
          dispatch(clearUploadPitchVideo());
        },
        clearPitchVersions: () => {
          dispatch(clearGetPitchVersions());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Pitch);
