import { connect } from 'react-redux'
import Offer from './Offer';
import {
  getOffer,
  clearGetOffer,
  patchOffer,
  clearPatchOffer,
  getOrganisationOffersInspect,
  clearGetOrganisationOffersInspect } from '../../redux/modules/offer';
import { getOrganisation, clearGetOrganisation } from '../../redux/modules/organisation';

const mapStateToProps = ({ auth, offer, organisations }) => ({
  meState: auth.me,
  offerState: offer.getOffer,
  organisationOffersInspectState: offer.getOrganisationOffersInspect,
  updateOfferState: offer.patchOffer,
  organisationState: organisations.getOrganisation,
  myOrganisationState: organisations.getOrganisationVersionsNavBar
});

const mapDispatchToProps = (dispatch) => {
  return {
    getOffer: (id) => dispatch(getOffer(id)),
    getOrganisationOffersInspect: (orgId) => dispatch(getOrganisationOffersInspect(orgId)),
    getOrganisation: (orgId) => dispatch(getOrganisation(orgId)),
    updateOffer: (offer, id) => {
      dispatch(patchOffer(offer, id));
    },
    clearGetOrganisation: () => {
      dispatch(clearGetOrganisation());
    },
    clearState: () => {
      dispatch(clearGetOffer());
      dispatch(clearGetOrganisation());
      dispatch(clearGetOrganisationOffersInspect());
    },
    clearUpdateOffer: () => {
      dispatch(clearPatchOffer());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Offer);
