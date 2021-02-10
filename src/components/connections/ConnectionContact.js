import React from 'react';
import PropTypes from 'prop-types';
import { getUsersName, getUserInitials } from '../../helpers';
import { useTranslation } from 'react-i18next';

const ConnectionContact = (props) => {
  const { contact } = props;
  const { t } = useTranslation();

  const initials = getUserInitials(contact);

  return (
    <li className="u-flex u-flex--break-md u-flex--space-between c-connection-contact u-padding-horizontal-large u-padding-vertical-small u-margin-top-small">
      <div className="u-flex u-flex--centered u-margin-bottom-small">
        <div className="c-connection-contact__avatar u-flex u-flex--centered u-flex--justify-centered" role="presentation" style={contact.avatar ? {backgroundImage: `url(${contact.avatar})`} : null} >
          {!contact.avatar &&
            <p className="u-font-primary u-font-massive u-text-uppercase u-text-bold u-font-large u-margin-none u-text-white">
              {initials}
            </p>
          }
        </div>
        <div className="u-padding-horizontal-small u-margin-left-small">
          <h3 className="u-margin-none u-text-bold u-text-spaced">{getUsersName(contact)}</h3>
          <p className="u-margin-none u-font-primary">{contact.job_role}</p>
        </div>
      </div>
      <div className="u-margin-horizontal-small">
        <ul className="u-list-unstyled c-connection-contact__details">
          {contact.email_address &&
            <li className="u-margin-bottom-tiny">
              <b>{t('connections.email')}</b> <a className="u-link" href={`mailto://${contact.email_address}`}>{contact.email_address}</a>
            </li>
          }
          {contact.phone_number &&
            <li className="u-margin-bottom-tiny">
              <b>{t('connections.phone')}</b> <a className="u-link" href={`tel://${contact.phone_number}`}>{contact.phone_number}</a>
            </li>
          }
          {contact.address &&
            <li className="u-margin-bottom-tiny">
              <b>{t('connections.address')}</b> {contact.address}
            </li>
          }
        </ul>
      </div>
    </li>
  );
};

ConnectionContact.propTypes = {
  contact: PropTypes.object.isRequired
};

export default ConnectionContact;
