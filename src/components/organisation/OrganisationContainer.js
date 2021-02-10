import { connect } from 'react-redux'
import Organisation from './Organisation';
import { getTeamMembers,
         getInspectTeamMembers,
         clearTeamMembers,
         removeTeamMember,
         clearRemoveTeamMember,
         clearInspectTeamMembers } from '../../redux/modules/teamMembers';
import { getOrganisationPitches,
  clearGetOrganisationPitches,
  getPitchesInspect,
  clearGetPitchesInspect } from '../../redux/modules/pitch';

import { getOrganisationOffers,
  getOrganisationOffersInspect,
  clearGetOrganisationOffers,
  clearGetOrganisationOffersInspect } from '../../redux/modules/offer';

import {
  getOrganisationDocuments,
  getDocumentsInspect,
  clearGetDocuments,
  clearInspectDocuments
} from '../../redux/modules/documentAwards';
import {
  patchOrganisation,
  clearPatchOrganisation,
  clearOrganisationVersions,
  clearGetOrganisationVersionsNavBar
} from '../../redux/modules/organisation';

import { clearGetOfferDrafts, clearGetPitchDrafts, getDrafts } from '../../redux/modules/drafts';

const mapStateToProps = ({ auth, organisations, teamMembers, pitch, users, documentAwards, offer, drafts }) => ({
  teamMembersState: teamMembers.getTeamMembers,
  inspectTeamMembersState: teamMembers.getInspectTeamMembers,
  pitchesState: pitch.getOrganisationPitches,
  inspectPitchesState: pitch.getPitchesInspect,
  inspectDocumentsState: documentAwards.getDocumentsInspect,
  documentsState: documentAwards.getOrganisationDocuments,
  meState: auth.me,
  updateOrganisationState: organisations.patchOrganisation,
  offersState: offer.getOrganisationOffers,
  inspectOfferState: offer.getOrganisationOffersInspect,
  getOfferDraftsState: drafts.getOfferDrafts,
  getPitchDraftsState: drafts.getPitchDrafts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getTeamMembers: (organisationId)  => {
      dispatch(getTeamMembers(organisationId));
    },
    getInspectTeamMembers: (organisationId) => {
      dispatch(getInspectTeamMembers(organisationId));
    },
    getOrganisationPitches: (organisationId) => {
      dispatch(getOrganisationPitches(organisationId));
    },
    getInspectOrganisationPitches: (organisationId) => {
      dispatch(getPitchesInspect(organisationId));
      dispatch(getDrafts('pitch'));
    },
    getOrganisationDocuments: (organisationId) => {
      dispatch(getOrganisationDocuments(organisationId));
    },
    getDocumentsInspect: (organisationId) => {
      dispatch(getDocumentsInspect(organisationId));
    },
    getOrganisationOffers: (id) => {
      dispatch(getOrganisationOffers(id))
    },
    getOrganisationOffersInspect: (id) => {
      dispatch(getOrganisationOffersInspect(id));
      dispatch(getDrafts('offer'));
    },
    clearState: () => {
      dispatch(clearGetOrganisationPitches());
      dispatch(clearGetPitchesInspect());
      dispatch(clearGetDocuments());
      dispatch(clearInspectDocuments());
      dispatch(clearPatchOrganisation());
      dispatch(clearGetOrganisationOffers());
      dispatch(clearGetOrganisationOffersInspect());
      dispatch(clearGetPitchDrafts());
      dispatch(clearGetOfferDrafts());
    },
    clearOrganisationVersions: () => {
      dispatch(clearOrganisationVersions())
    },
    clearGetOrganisationVersionsNavBar: () => {
      dispatch(clearGetOrganisationVersionsNavBar());
    },
    clearTeamMembers: () => {
      dispatch(clearTeamMembers());
      dispatch(clearInspectTeamMembers());
    },
    updateOrganisation: (organisation, id) => {
      dispatch(patchOrganisation(organisation, id));
    },
    clearUpdateOrganisation: (organisation, id) => {
      dispatch(clearPatchOrganisation());
    },
    removeTeamMember: (id) => {
      dispatch(removeTeamMember(id));
    },
    clearRemoveTeamMember: () => {
      dispatch(clearRemoveTeamMember());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Organisation);
