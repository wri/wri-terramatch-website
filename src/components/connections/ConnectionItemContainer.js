import { connect } from 'react-redux';
import ConnectionItem from './ConnectionItem';
import { unmatchConnection, getMatches, clearUnmatch, clearGetMatches } from '../../redux/modules/matches';
import { getRecievedInterests, getInitiatedInterests, clearGetRecievedInterests, clearGetInitiatedInterests } from '../../redux/modules/interests';

const mapStateToProps = ({ matches }) => ({
  unmatchConnectionState: matches.unmatchConnection
});

const mapDispatchToProps = (dispatch) => {
  return {
    unmatchConnection: (attributes) => {
      dispatch(unmatchConnection(attributes));
    },
    getMatches: () => {
      dispatch(getMatches());
      dispatch(getInitiatedInterests());
      dispatch(getRecievedInterests());
    },
    clearUnmatch: () => {
      dispatch(clearUnmatch());
    },
    clearState: () => {
      dispatch(clearUnmatch());
      dispatch(clearGetMatches());
      dispatch(clearGetInitiatedInterests());
      dispatch(clearGetRecievedInterests());
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ConnectionItem);
