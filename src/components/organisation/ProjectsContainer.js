import { connect } from 'react-redux'
import { updatePitchVisibility, clearUpdatePitchVisibility } from '../../redux/modules/pitch';
import { updateOfferVisibility, clearUpdateOfferVisibility } from '../../redux/modules/offer';
import { getDrafts, deleteDraft, clearDeleteDraft } from '../../redux/modules/drafts';
import Projects from './Projects';

const mapStateToProps = ({ pitch, offer, organisations, drafts, auth }) => ({
  archivePitchState: pitch.updatePitchVisibility,
  archiveOfferState: offer.updateOfferVisibility,
  organisationVersions: organisations.getOrganisationVersionsNavBar,
  getOfferDraftsState: drafts.getOfferDrafts,
  getPitchDraftsState: drafts.getPitchDrafts,
  deleteDraftState: drafts.deleteDraft,
  me: auth.me
});

const mapDispatchToProps = (dispatch) => {
  return {
    archivePitch: (id) => {
      dispatch(updatePitchVisibility(id, "archived"));
    },
    clearArchivePitch: () => {
      dispatch(clearUpdatePitchVisibility());
    },
    archiveOffer: (id) => {
      dispatch(updateOfferVisibility(id, "archived"));
    },
    clearArchiveOffer: () => {
      dispatch(clearUpdateOfferVisibility());
    },
    getDrafts: (type) => {
      dispatch(getDrafts(type));
    },
    deleteDraft: (id) => {
      dispatch(deleteDraft(id));
    },
    clearDeleteDraft: () => {
      dispatch(clearDeleteDraft());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
