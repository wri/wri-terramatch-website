import { connect } from 'react-redux';
import VerifyUser from './VerifyUser';
import { verify } from '../../redux/modules/auth';


const mapStateToProps = ({ app, auth }) => ({
  searchQuery: app.searchQuery,
  verifyState: auth.verify,
  meState: auth.me
});

const mapDispatchToProps = (dispatch) => {
  return {
    verify: (token) => {
      dispatch(verify(token));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(VerifyUser);
