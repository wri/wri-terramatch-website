import React from 'react'
import PropTypes from 'prop-types'
import { getTranslation } from '../../helpers/wp';
import { Link } from 'react-router-dom';

const NewsListItem = (props) => {
  const { item, langCode } = props;

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
          style={{backgroundImage: `url(${item.head_image})`}}
          className="c-news-item__image"
          role="img"
          aria-label={item.header_image_alt_text}
        />
        <Link className="u-text-decoration-none" to={`/news/${item.new_item_name}`}>
          <h3 className="c-news-item__header u-text-bold u-margin-vertical-small">{getTranslation(langCode, item.new_item_title)}</h3>
        </Link>
        <h4 className="c-news-item__subtext u-text-uppercase u-text-bold">{item.subtitle}</h4>
        <div className="c-news-item__content">
          <p>{item.preview_text}</p>
        </div>
      </div>
  )
};

NewsListItem.propTypes = {
  item: PropTypes.object.isRequired,
  langCode: PropTypes.string.isRequired
};

export default NewsListItem;
