import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import MemberListItemSquare from './MemberListItemSquare';

const MemberListItem = (props) => {
  const { user, showAccountStatus } = props;
  const { t } = useTranslation();

  const invitedUser = !('avatar' in user); // Invited users will not have an avatar.
  const isAdmin = user.role === 'admin';
  return (
    <li className="c-add-users__list-item">
      <div className="c-add-users__profile-picture-container">
        {!invitedUser &&
        <div role="presentation" className="c-add-users__profile-picture" style={{backgroundImage: `url(${user.avatar})`}}></div>
        }
      </div>
      <div className={`c-add-users__profile-content u-text-left ${!invitedUser ? 'c-add-users__profile-content--has-avatar' : ''}`}>
        {invitedUser &&
        <span className="c-pill c-add-users__invite-sent">{t('addTeamMember.details.inviteSent')}</span>
        }
        <h3 className="u-text-bold u-font-normal u-margin-top-tiny u-text-ellipsis">{user.first_name} {user.last_name}</h3>
        <p className="u-font-primary u-margin-none">{user.job_role}</p>
        {(invitedUser || isAdmin) && <p className="u-font-primary u-margin-none u-text-bold u-text-ellipsis">{user.email_address}</p>}
        {isAdmin && !user.email_address_verified_at && <p className="u-font-small u-font-primary u-margin-none"> {t('addTeamMember.details.awaitingConfirmation')} </p>}
        {showAccountStatus && <p className="u-font-small u-font-primary u-margin-none">{invitedUser ? t('addTeamMember.details.awaitingConfirmation') : t('addTeamMember.details.noAccountProfile')}</p>}
      </div>
    </li>
  );
};

MemberListItem.propTypes = {
  user: PropTypes.object.isRequired,
  showAccountStatus: PropTypes.bool.isRequired,
  isSquare: PropTypes.bool
};

MemberListItem.defaultProps = {
  isSquare: false
}


export default (props) => props.isSquare ?
  <MemberListItemSquare {...props}/> :
  <MemberListItem {...props} />;
