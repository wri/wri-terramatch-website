import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import { Loader, Button } from 'tsc-chameleon-component-library';
import PanelItem from '../../components/panelItem/PanelItem';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getNotificationURL } from '../../helpers';

const Notifications = (props) => {
  const { t, i18n } = useTranslation();
  const { notificationsState,
    getNotifications,
    clearNotificationState,
    markNotificationRead
  } = props;

  useEffect(() => {
    clearNotificationState();
    getNotifications();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Only run once, so disable eslint

  const notificationsUnread = [];
  const notificationsRead = [];

  if (notificationsState.data) {
    notificationsState.data.forEach((notification) => {
      const localeMoment = moment.utc(notification.created_at).local().locale(i18n.language);

      const component = (<PanelItem key={notification.id} className="u-margin-small u-flex u-flex--centered u-flex--space-between u-flex--break-md">
          <div>
            <h3 className="u-text-bold u-text-spaced-small u-margin-bottom-none u-font-grey">
              {t(`api.notification.actions.${notification.action}`)}
            </h3>
            <p className="u-font-primary u-margin-none u-font-grey u-text-spaced-small">
              {t(`api.notification.typeMessages.${notification.action}.${notification.referenced_model}`)}
            </p>
            <span>{localeMoment.fromNow()}</span>
          </div>
          <Link to={getNotificationURL(notification)} >
            <Button click={() => {
                if (notification.unread) {
                  markNotificationRead(notification.id, notification.referenced_model, notification.referenced_model_id)
                }
              }
            }>{t('common.preview')}</Button>
          </Link>
        </PanelItem>);

        if (notification.unread) {
          notificationsUnread.push(component);
        } else {
          notificationsRead.push(component);
        }
    });
  };

  return (
    <section className="c-section c-section--standard-width">
      <h1 className="u-padding-bottom-small">{t('notifications.yourNotifications')}</h1>

      {notificationsState.isFetching && <Loader />}

      {notificationsUnread.length > 0 &&
        <>
          <h2 className="u-text-uppercase u-font-normal">{t('notifications.unread')}</h2>
          {notificationsUnread}
        </>
      }

      {notificationsRead.length > 0 &&
        <>
          <h2 className="u-text-uppercase u-font-normal">{t('notifications.read')}</h2>
          {notificationsRead}
        </>
      }

      {notificationsRead.length === 0 && notificationsUnread.length === 0 && !notificationsState.isFetching &&
        <p>{t('notifications.empty')}</p>
      }
    </section>
  )
};

Notifications.propTypes = {
  notificationsState: initialAsyncStatePropType.isRequired,
  getNotifications: PropTypes.func.isRequired,
  clearNotificationState: PropTypes.func.isRequired,
  markNotificationRead: PropTypes.func.isRequired
};

export default Notifications;
