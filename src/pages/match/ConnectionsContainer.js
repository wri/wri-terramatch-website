import { connect } from 'react-redux'
import Connections from './Connections';
import { getMatches, clearGetMatches } from '../../redux/modules/matches';
import { getRecievedInterests, getInitiatedInterests, clearGetRecievedInterests, clearGetInitiatedInterests } from '../../redux/modules/interests';

const mapStateToProps = ({auth, matches, interests, organisations}) => ({
  getMatchesState: matches.getMatches,
  getRecievedInterestsState: interests.getRecievedInterests,
  getInitiatedInterestsState: interests.getInitiatedInterests,
  getOrganisationVersionsNavBar: organisations.getOrganisationVersionsNavBar,
  meState: auth.me
});

const mapDispatchToProps = (dispatch) => {
  return {
    getMatches: () => {
      dispatch(getMatches());
    },
    getRecievedInterests: () => {
      dispatch(getRecievedInterests());
    },
    getInitiatedInterests: () => {
      dispatch(getInitiatedInterests());
    },
    clearState: () => {
      dispatch(clearGetMatches());
      dispatch(clearGetRecievedInterests());
      dispatch(clearGetInitiatedInterests());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
