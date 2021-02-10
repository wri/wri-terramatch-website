import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const NotificationBar = (props) => {
  const { message, title, onClose, params } = props;
  const { t } = useTranslation();

  return (
    <div className="c-notification-bar u-text-center" role="alert">
      <p className="c-notification-bar__title
        u-font-primary u-font-large u-text-bold
        u-text-black u-text-uppercase u-text-spaced
        u-margin-top-none u-margin-bottom-tiny
        u-padding-horizontal-small">
        {t(title)}
      </p>
      <p className="c-notification-bar__message u-margin-top-none u-padding-horizontal-small">{t(message, params)}</p>
      <button onClick={onClose}
       className="c-close-button c-notification-bar__close"
       aria-label={t('common.close')}
      >
        <div role="presentation" className="c-icon c-icon--close" />
      </button>
    </div>
  );
};

NotificationBar.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  params: PropTypes.object
};

NotificationBar.defaultProps = {
  params: {}
};

export default NotificationBar;
