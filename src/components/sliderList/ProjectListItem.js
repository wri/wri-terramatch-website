import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent, Button } from 'tsc-chameleon-component-library';
import locationPin from '../../assets/images/icons/location-pin.svg';
import awardImage from '../../assets/images/icons/award-primary.svg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import placeholderCover from '../../assets/images/pitches/option-placeholder.png';

const ProjectListItem = (props) => {
  const { item, buttonText, onArchive, type, hideCompatibility, linkParams, fromUrl, isDraft, draftId, showStatus } = props;
  const { t } = useTranslation();

  let link = '';

  if (type === 'pitch') {
    link = isDraft ? `createProject/${draftId}` : `projects/${item.id}`;
  } else if (type === 'funding') {
    link = isDraft ? `createOffer/${draftId}` : `funding/${item.id}`;
  }

  if (linkParams) {
    link += `?${linkParams}`;
  }

  const isArchived = item.completed && !item.successful;

  const getProjectStatusText = () => {
    if (isDraft) {
      return t('drafts.draft');
    }

    const translationKey = type === 'pitch' ? 'api.visibilities.pitch' : 'api.visibilities.offer';
    return t(`${translationKey}.${item.visibility}`);
  };

  return (
    <div className={`c-project u-margin-small u-text-left ${isArchived && 'c-project--archived'}`} data-testid="test-project">
      <Card>
        <CardHeader
          image={item.cover_photo ? item.cover_photo : placeholderCover}
          imageAlt=""
        >
          { isDraft &&
            <button onClick={()=> {onArchive(item, draftId)}}
            aria-label="Remove"
            className="c-button c-button--icon-only c-button--danger c-project__remove">
              <div role="presentation" className="c-icon c-icon--trash-white"></div>
            </button>
          }
          { (showStatus || isDraft) &&
            <div className="c-project__pill u-text-center u-margin-bottom-tiny">
              <p className="u-font-primary u-text-bold u-text-uppercase u-margin-none">{getProjectStatusText()}</p>
            </div>
          }

        </CardHeader>
        <CardContent>
          <div className="c-project__project-logo" style={{ backgroundImage: `url(${item.avatar})` }} role="presentation"></div>
          <Link to={`${fromUrl ? `/${fromUrl}` : ''}/${link}`} className="u-link">
            <h3 className="u-text-uppercase u-text-bold u-margin-bottom-tiny c-project__title u-text-ellipsis">{item.name}</h3>
          </Link>
          <div className="u-flex u-flex--space-between u-margin-bottom-small">
            <span className="u-flex u-flex--centered">
              {(item.land_country || item.land_continent) && <img src={locationPin} alt="" role="presentation"/>}
              <span className="u-text-uppercase u-font-tiny u-margin-left-tiny">
                {item.land_country ? t(`api.countries.${item.land_country}`) : item.land_continent && t(`api.continents.${item.land_continent}`)}
              </span>
            </span>
            { item.award && <span className="u-flex u-flex--centered">
              <img src={awardImage} alt="" role="presentation"/>
              <span className="u-text-uppercase u-font-tiny u-margin-left-tiny">{item.award}</span>
            </span> }
          </div>
          <p className="u-font-primary c-project__description">{item.description}</p>
          {(item.funding_amount || item.compatibility_score >= 0) &&
          <div className="u-flex u-flex--space-between u-margin-bottom-small c-project__details">
            {item.funding_amount &&
            <span className="u-width-100 u-text-center u-padding-tiny c-project__details-item">
              <p className="u-text-uppercase u-font-primary u-font-tiny">{type === "pitch" ? t('project.funding.amount') : t('offer.amount')}</p>
              <p className="u-text-uppercase u-text-bold u-font-primary">${item.funding_amount.toLocaleString()}</p>
            </span>
            }
            { (item.compatibility_score !== null && !hideCompatibility) &&
            <span className="u-width-100 u-text-center u-padding-tiny c-project__details-item">
              <p className="u-text-uppercase u-font-primary u-font-small">{t('landing.project.compatibility')}</p>
              <p className="u-text-uppercase u-text-bold u-font-primary">{item.compatibility_score}%</p>
            </span>}
          </div>
          }
          <Link to={`${fromUrl ? `/${fromUrl}` : ''}/${link}`}>
            <Button
            variant="secondary"
            className="c-button--small u-margin-top-tiny u-margin-bottom-small c-project__read-more"
            icon
            iconName="arrow-right">{buttonText}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
};

ProjectListItem.propTypes = {
  item: PropTypes.object.isRequired,
  buttonText: PropTypes.string.isRequired,
  canArchive: PropTypes.bool,
  onArchive: PropTypes.func,
  type: PropTypes.oneOf(['funding', 'pitch']),
  linkParams: PropTypes.string,
  fromUrl: PropTypes.string,
  showStatus: PropTypes.bool,
  isDraft: PropTypes.bool,
  draftId: PropTypes.number
};

ProjectListItem.defaultProps = {
  canArchive: false,
  onArchive: () => {},
  type: 'pitch',
  linkParams: '',
  fromUrl: null,
  showStatus: false,
  isDraft: false,
  draftId: null
};

export default ProjectListItem;
