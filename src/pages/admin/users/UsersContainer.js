import { connect } from 'react-redux';
import Users from './Users';
import { getAdmins, inviteAdmin } from '../../../redux/modules/admin';

const mapStateToProps = ({ admin }) => ({
  getAdminsState: admin.getAdmins,
  inviteAdminState: admin.inviteAdmin
});

const mapDispatchToProps = (dispatch) => {
  return {
    getAdmins: () => {
      dispatch(getAdmins());
    },
    inviteAdmin: (email) => {
      dispatch(inviteAdmin(email));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
