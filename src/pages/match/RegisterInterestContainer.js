import { connect } from 'react-redux'
import RegisterInterest from './RegisterInterest';
import { getOrganisationPitches, clearGetOrganisationPitches } from '../../redux/modules/pitch';
import { getOrganisationOffers, clearGetOrganisationOffers } from '../../redux/modules/offer';
import { createInterest, clearCreateInterest } from '../../redux/modules/interests';

const mapStateToProps = ({pitch, auth, offer, interests}) => ({
  getPitchesState: pitch.getOrganisationPitches,
  getOffersState: offer.getOrganisationOffers,
  createInterestState: interests.createInterest,
  meState: auth.me
});

const mapDispatchToProps = (dispatch) => {
  return {
    getOrganisationPitches: (organisationId) => {
      dispatch(getOrganisationPitches(organisationId));
    },
    getOrganisationOffers: (organisationId) => {
      dispatch(getOrganisationOffers(organisationId));
    },
    createInterest: (model) => {
      dispatch(createInterest(model));
    },
    clearState: () => {
      dispatch(clearGetOrganisationPitches());
      dispatch(clearGetOrganisationOffers());
      dispatch(clearCreateInterest());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterInterest);
