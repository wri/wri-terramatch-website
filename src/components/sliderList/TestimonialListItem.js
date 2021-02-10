import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

const TestimonialListItem = (props) => {
  const { t } = useTranslation();
  const { item } = props;

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
      <div className={`c-news-item
      u-margin-horizontal-small u-padding-vertical-small
      u-flex u-flex--column u-flex--centered u-flex--justify-centered`}
      data-testid="test-news">
        <div
          style={{backgroundImage: `url(${item.avatar})`}}
          className="c-news-item__image"
          role="img"
          aria-label={t('common.avatar')}
        />
      <h3 className="c-news-item__header u-text-bold u-margin-vertical-small">{item.name}</h3>
        <h4 className="c-news-item__subtext u-text-uppercase u-text-bold">{item.job_role}</h4>
        <div className="c-news-item__content">
          <p>{item.quote}</p>
        </div>
      </div>
  )
};

TestimonialListItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default TestimonialListItem;
