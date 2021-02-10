import { connect } from 'react-redux';
import { changePassword, clearChangePassword } from '../../redux/modules/auth';
import PasswordReset from './PasswordReset';

const mapStateToProps = ({auth}) => ({
    changePasswordState: auth.changePassword
});

const mapDispatchToProps = (dispatch) => {
    return {
        changePassword: (changeDetails) => dispatch(changePassword(changeDetails)),
        clearState: () => dispatch(clearChangePassword())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);
