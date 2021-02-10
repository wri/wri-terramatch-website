import { connect } from 'react-redux'
import Project from './Project';
import { getCarbonCertifications,
         getCarbonCertificationsInspect,
         patchCarbonCertificates,
         createCarbonCertificates,
         clearPatchCarbonCertificates,
         clearCreateCarbonCertificates,
         clearGetCarbonCertifications,
         clearGetCarbonCertificationsInspect
       } from '../../redux/modules/carbonCertifications';
import { getMetrics,
         getMetricsInspect,
         patchMetrics,
         clearPatchMetrics,
         clearCreateMetrics,
         clearGetMetrics,
         clearGetMetricsInspect
        } from '../../redux/modules/metrics';
import { getTreeSpecies,
         patchTreeSpecies,
         clearPatchTreeSpecies,
         clearCreateTreeSpecies,
         clearGetTreeSpecies,
         getTreeSpeciesInspect,
         clearGetTreeSpeciesInspect
       } from '../../redux/modules/treeSpecies';
import { getOrganisation, clearGetOrganisation } from '../../redux/modules/organisation';
import { getOrganisationOffers } from '../../redux/modules/offer';
import { getPitchDocuments,
         getPitchDocumentsInspect,
         clearInspectPitchDocuments,
         clearGetPitchDocuments
       } from '../../redux/modules/documentAwards';
import { inviteUser } from '../../redux/modules/users';
import { patchPitch, clearPatchPitch, getPitchContacts, clearPitchContacts } from '../../redux/modules/pitch';

const mapStateToProps = ({
    auth,
    teamMembers,
    organisations,
    carbonCertifications,
    metrics,
    treeSpecies,
    offer,
    documentAwards,
    pitch,
    users
  }) => ({
    teamMembers: pitch.getPitchContacts,
    organisation: organisations.getOrganisation,
    carbonCertifications: carbonCertifications.getCarbonCertifications,
    carbonCertificationsInspect: carbonCertifications.getCarbonCertificationsInspect,
    metrics: metrics.getMetrics,
    metricsInspect: metrics.getMetricsInspect,
    treeSpecies: treeSpecies.getTreeSpecies,
    treeSpeciesInspect: treeSpecies.getTreeSpeciesInspect,
    userOffers: offer.getOrganisationOffers,
    documents: documentAwards.getPitchDocuments,
    documentsInspect: documentAwards.getPitchDocumentsInspect,
    inviteUser: users.inviteUserState,
    me: auth.me,
    updateProjectState: pitch.patchPitch,
    updateMetricsState: metrics.patchMetrics,
    updateTreeSpeciesState: treeSpecies.patchTreeSpecies,
    updateCarbonCertificatesState: carbonCertifications.patchCarbonCertificates,
    createCarbonCertificatesState: carbonCertifications.createCarbonCertificates
});

const mapDispatchToProps = (dispatch) => {
  return {
    getTreeSpecies: (pitchId) => {
      dispatch(getTreeSpecies(pitchId));
    },
    getTreeSpeciesInspect: (pitchId) => {
      dispatch(getTreeSpeciesInspect(pitchId));
    },
    getMetrics: (pitchId) => {
      dispatch(getMetrics(pitchId));
    },
    getMetricsInspect: (pitchId) => {
      dispatch(getMetricsInspect(pitchId));
    },
    getCarbonCertifications: (pitchId) => {
      dispatch(getCarbonCertifications(pitchId))
    },
    getCarbonCertificationsInspect: (pitchId) => {
      dispatch(getCarbonCertificationsInspect(pitchId))
    },
    getTeamMembers: (pitchId) => {
      dispatch(getPitchContacts(pitchId));
    },
    getOrganisation: (organisationId) => {
      dispatch(getOrganisation(organisationId));
    },
    getDocuments: (pitchId) => {
      dispatch(getPitchDocuments(pitchId));
    },
    getDocumentsInspect: (pitchId) => {
      dispatch(getPitchDocumentsInspect(pitchId));
    },
    getUserOffers: (organisationId) => {
      dispatch(getOrganisationOffers(organisationId));
    },
    updateProject: (project) => {
      dispatch(patchPitch(project));
    },
    inviteUserState: (user) => {
      dispatch(inviteUser(user));
    },
    updateMetrics: (metricsArray) => dispatch(patchMetrics(metricsArray)),
    updateTreeSpecies: (treesArray) => dispatch(patchTreeSpecies(treesArray)),
    updateCarbonCertificates: (carbonArray) => dispatch(patchCarbonCertificates(carbonArray)),
    clearUpdateProject: () => {
      dispatch(clearPatchPitch());
    },
    createCarbonCertificates: (carbonArrray) => {
      dispatch(createCarbonCertificates(carbonArrray));
    },
    clearGetOrganisation: () => dispatch(clearGetOrganisation()),
    clearState: () => {
      dispatch(clearPitchContacts());
      dispatch(clearGetMetrics());
      dispatch(clearGetCarbonCertifications());
      dispatch(clearGetTreeSpecies());
      dispatch(clearGetTreeSpeciesInspect());
      dispatch(clearGetMetricsInspect());
      dispatch(clearGetCarbonCertificationsInspect());
      dispatch(clearGetPitchDocuments());
      dispatch(clearInspectPitchDocuments());
    },
    clearUpdateState: () => {
      dispatch(clearPatchPitch());
      dispatch(clearPatchCarbonCertificates());
      dispatch(clearPatchMetrics());
      dispatch(clearPatchTreeSpecies());
      dispatch(clearCreateCarbonCertificates());
      dispatch(clearCreateTreeSpecies());
      dispatch(clearCreateMetrics());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
