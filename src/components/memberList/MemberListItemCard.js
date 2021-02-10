import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'tsc-chameleon-component-library';
import { getUserInitials, getUserKey, getUsersName } from '../../helpers';

const MemberListItemCard = (props) => {
  const { t } = useTranslation();
  const { user,
          isSelectable,
          onSelectChange,
          isSelected,
          isCompact,
          canDelete,
          onRemove,
          canSeeDetails,
          canEdit,
          onEdit } = props;

  const name = getUsersName(user);
  const initials = getUserInitials(user);
  const key = getUserKey(user);
  const Element = isSelectable ? 'div' : 'li'

  const inner =
      (<Element className={`c-user c-user--is-card
                      ${isSelectable ? 'c-user--is-selectable' : ''}
                      ${isSelected ? 'c-user--is-selected' : ''}
                      ${isCompact ? 'c-user--compact' : ''}`}>
        <div className="c-user__action">
          {canEdit &&
          <Button className="c-button--tiny u-margin-bottom-tiny u-display-block"
                  click={()=> onEdit(user)}>
            {t('common.edit')}
          </Button>}

          {canDelete &&
          <Button className="c-button--tiny has-icon has-icon--cross-right u-margin-top-tiny u-display-block"
                  variant="danger"
                  click={()=> onRemove(user)}>
            {t('common.remove')}
          </Button>}
        </div>
        <div className="c-user__profile-picture-container">
          {user.avatar
            ?
            <div role="presentation" className="c-user__profile-picture" style={{backgroundImage: `url(${user.avatar})`}}></div>
            :
            <div className="c-user__profile-initials" role="img" aria-label={name}>
              <p className="u-font-primary u-font-massive u-text-uppercase u-text-bold" style={{color: 'white'}}>{initials}</p>
            </div>
          }
        </div>
        <div className="c-user__profile-content">
          <h3 className="u-text-bold u-font-medium u-margin-top-tiny u-text-uppercase u-text-ellipsis u-text-left">{name}</h3>
          <p className="u-font-primary u-margin-none u-text-ellipsis u-text-left u-text-bold u-text-dark-grey">{user.job_role ? user.job_role : t('user.member')}</p>
          { canSeeDetails &&
            <ul className="u-text-left u-list-unstyled u-margin-vertical-small u-text-dark-grey">
              <li className="u-font-primary u-text-wrap">
                <b>{t('connections.email')}</b> <a className="u-link" href={`mailto://${user.email_address}`}>{user.email_address}</a>
              </li>
              <li className="u-font-primary u-text-wrap">
                <b>{t('connections.phone')}</b> <a className="u-link" href={`tel://${user.phone_number}`}>{user.phone_number}</a>
              </li>
            </ul>
          }
        </div>
      </Element>);

  return (
    isSelectable ?
      <li className="u-display-inline-block u-margin-tiny">
        <input
          id={`checkbox-${key}`}
          type="checkbox"
          className="u-visually-hidden c-user__checkbox-input"
          onChange={() => onSelectChange(user)}
          checked={isSelected} />
        <label htmlFor={`checkbox-${key}`} className="c-user__label">
          {inner}
        </label>
      </li> :
      inner
    );
};

MemberListItemCard.propTypes = {
  user: PropTypes.object.isRequired,
  isSelectable: PropTypes.bool,
  onSelectChange: PropTypes.func,
  isSelected: PropTypes.bool
};

MemberListItemCard.defaultProps = {
  isSelectable: false,
  onSelectChange: () => {},
  isSelected: false
};

export default MemberListItemCard;
