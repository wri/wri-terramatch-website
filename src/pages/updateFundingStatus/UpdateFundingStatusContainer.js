import { connect } from 'react-redux';
import { updatePitchVisibility, clearUpdatePitchVisibility } from '../../redux/modules/pitch';
import { updateOfferVisibility, clearUpdateOfferVisibility } from '../../redux/modules/offer';
import UpdateFundingStatus from './UpdateFundingStatus';

const mapStateToProps = ({pitch, offer}) => {
  return ({
    updatePitchVisibilityState: pitch.updatePitchVisibility,
    updateOfferVisibilityState: offer.updateOfferVisibility
  })
};


const mapDispatchToProps = (dispatch) => {
  return {
    updatePitchVisibility: (id, visibility) => dispatch(updatePitchVisibility(id, visibility)),
    updateOfferVisibility: (id, visibility) => dispatch(updateOfferVisibility(id, visibility)),
    clearState: () => {
      dispatch(clearUpdatePitchVisibility());
      dispatch(clearUpdateOfferVisibility());
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(UpdateFundingStatus);
