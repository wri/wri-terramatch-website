import { connect } from 'react-redux';
import DraftSelection from './DraftSelection';
import { clearGetOfferDrafts, clearGetPitchDrafts, getDrafts } from '../../redux/modules/drafts';

const mapStateToProps = ({ drafts }) => ({
  getOfferDraftsState: drafts.getOfferDrafts,
  getPitchDraftsState: drafts.getPitchDrafts
});

const mapDispatchToProps = (dispatch) => {
  return {
    getDrafts: (type) => {
      dispatch(getDrafts(type));
    },
    clearGetDrafts: () => {
      dispatch(clearGetOfferDrafts());
      dispatch(clearGetPitchDrafts());
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DraftSelection);
