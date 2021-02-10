import { connect } from 'react-redux';
import Reports from './Reports';

const mapStateToProps = ({ auth }) => ({
  loginState: auth.login
});

export default connect(mapStateToProps)(Reports);
