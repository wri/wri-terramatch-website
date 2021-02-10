import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'tsc-chameleon-component-library';
import { getTranslation } from '../../helpers/wp';

const LandingPrivate = (props) => {
  const { newsArr, newsArrLoading  } = props;
  const { t, i18n } = useTranslation();

  const newsItem = newsArr[0];

  return (
    <article className="c-landing">
      { (newsArrLoading || newsItem) &&
      <section className="c-section c-section--light u-padding-none c-landing__news c-landing__news--singular">
        { newsItem  && <div className="u-flex u-flex--streched u-flex--break-md c-landing__news-container">
          <div className="o-flex-item o-flex-item--equal-basis u-text-center u-flex u-flex--column u-flex--centered u-flex--justify-centered">
            <div className="c-landing__news-content u-margin-vertical-small ">
              <h2 className="u-text-uppercase u-font-small u-margin-none u-text-spaced u-text-bold">{t('landing.news.latest')}</h2>
              <h3 className="u-font-huge u-text-bold u-margin-bottom-small">{getTranslation(i18n.language, newsItem.new_item_title)}</h3>
              <h4 className="u-text-uppercase u-text-bold u-font-large u-margin-top-none u-text-spaced">{newsItem.subtitle}</h4>
              <p className="u-margin-top-small u-margin-horizontal-small">{newsItem.preview_text}</p>
              <Link to={`/news/${newsItem.new_item_name}`}>
                <Button
                  className="c-button--small"
                  icon
                  iconName="arrow-right">{t('landing.news.readMore')}</Button>
              </Link>
            </div>
          </div>
          <div className="o-flex-item--equal-basis u-text-center">
            <div className="c-landing__news-image u-width-100 u-height-100"
              style={{backgroundImage: `url(${newsItem.head_image})`}}
              role="img" aria-label={newsItem.header_image_alt_text}>
            </div>
          </div>
        </div> }
      </section> }
    </article>
  )
};

export default LandingPrivate;
