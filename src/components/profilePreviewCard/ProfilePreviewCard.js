import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { yearsSinceOperation } from '../../helpers';
import { Link } from 'react-router-dom';

const ProfilePreviewCard = props => {
  const { item } = props;
  const { t } = useTranslation();

  return (
    <div className='c-profile-preview'>
      <div className='c-profile-preview__header'>
        <div className="c-profile-preview__logo u-margin-right-small" role="presentation" style={item.avatar ? {backgroundImage: `url(${item.avatar})`} : null} />
        <div className="c-profile-preview__header--text">
          <h3 className="u-text-uppercase u-text-bold u-font-normal">{item.name}</h3>
          <span>{t('createOrganisation.details.organisationType')} : {t(`api.organisation_types.${item.type}`)}</span>
          <span>
            {item.founded_at &&
              <p className="u-font-primary u-font-small u-text-bold u-margin-vertical-none">{t('organisation.yearsOfOperation', {count: yearsSinceOperation(item)})}</p>
            }
          </span>
        </div>
      </div>

      <Link to={`/organization/${item.id}`} className='c-profile-preview__cta c-button c-button--is-link u-text-center c-button--alternative'>
        {t('common.viewProfile')}
      </Link>
    </div>
  );
};

ProfilePreviewCard.propTypes = {
  item: PropTypes.object.isRequired
};

export default ProfilePreviewCard;
