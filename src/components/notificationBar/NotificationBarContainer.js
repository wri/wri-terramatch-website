import { connect } from 'react-redux';
import { closeNotificationBar } from '../../redux/modules/app';
import NotificationBar from './NotificationBar';

const mapStateToProps = ({ app }) => ({
  title: app.notificationBar.title,
  message: app.notificationBar.message,
  params: app.notificationBar.params,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch(closeNotificationBar());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBar);
