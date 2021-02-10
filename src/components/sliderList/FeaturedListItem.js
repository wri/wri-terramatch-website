import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { numberWithCommas } from '../../helpers';
import locationPin from '../../assets/images/icons/location-pin.svg';

const FeaturedListItem = (props) => {
  const { item } = props;
  const { t } = useTranslation();

  if (item.fetchSlide) {
    return (
      <div className={`c-news-item
        u-margin-horizontal-small u-padding-vertical-small
        u-flex u-flex--column u-flex--centered u-flex--justify-centered`}
        data-testid="test-news">
        <div className="c-news-item__image" />
      </div>
    )
  }

  return (
      <div className="c-featured-item u-flex u-flex--break-md u-margin-horizontal-small" data-testid="news-featured">
      <div
        className="c-featured-item__image"
        style={{backgroundImage: `url(${item.image})`}}
        role="img"
      />
      <div className="c-featured-item__details">
        <h3 className="u-text-bold u-text-uppercase">{item.project_name}</h3>
          <span className="u-text-bold u-flex u-margin-vertical-small">
            <img alt='' src={locationPin} className='c-project__pin u-margin-right-small' />
            {item.project_location}
          </span>

          <div className="c-featured-item__metrics u-padding-small">
            <h5 className="u-text-bold">{t('landing.numberOfTrees')}</h5>
            <p className="u-font-primary u-margin-none">{numberWithCommas(item.number_of_trees)}</p>
            <h5 className="u-text-bold">{t('landing.restorationType')}</h5>
            <p className="u-font-primary u-margin-none">
            {item.restoration_type}
            </p>
          </div>
          <p>{item.description}</p>
      </div>
      </div>
  )
};

FeaturedListItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default FeaturedListItem;
