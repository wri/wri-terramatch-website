import { connect } from 'react-redux'
import Notifications from './Notifications';
import { getNotifications, clearNotificationState, patchNotification } from '../../redux/modules/notifications';
import { getOrganisationVersionsNavBar } from '../../redux/modules/organisation';

const mapStateToProps = ({ notifications }) => ({
  notificationsState: notifications.getNotifications
});

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifications: () => {
      dispatch(getNotifications());
    },
    clearNotificationState: () => {
      dispatch(clearNotificationState());
    },
    markNotificationRead: (id, referencedModel, orgId) => {
      dispatch(patchNotification(id));
      if (referencedModel === 'Organisation') {
        dispatch(getOrganisationVersionsNavBar(orgId))
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
