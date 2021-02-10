import { connect } from 'react-redux';
import VersionHistoryTable from './VersionHistoryTable';
import { getAdmins, clearGetAdmins } from '../../redux/modules/admin';

const mapStateToProps = ({ admin }) => ({
  getAdminsState: admin.getAdmins
});

const mapDispatchToProps = (dispatch) => {
  return {
    getAdmins: () => {
      dispatch(getAdmins());
    },
    clearGetAdmins: (email) => {
      dispatch(clearGetAdmins());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionHistoryTable);
