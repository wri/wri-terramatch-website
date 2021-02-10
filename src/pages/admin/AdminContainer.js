import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Admin from './Admin';

const mapStateToProps = ({ app, auth }) => ({

});

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Admin));
