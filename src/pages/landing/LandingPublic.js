import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'tsc-chameleon-component-library';
import { gaEvent } from '../../helpers';
import Tab from '../../components/tab/Tab';
import SliderList from '../../components/sliderList/SliderList';
import partnerArr from '../../pages/landing/partnerArr';
import Map from '../../components/map/Map';
import PropTypes from 'prop-types'
import L from 'leaflet';
import Logo from '../../assets/images/wri-logo.png';
import laptopMobileImage from '../../assets/images/landing/laptop-mobile.png';
import laptopMobileImage2x from '../../assets/images/landing/laptop-mobile@2x.png';

const LandingPublic = (props) => {
  const {
    mapDefaultConfig,
    projectsArr,
    projectsArrLoading
  } = props;
  const { t, i18n } = useTranslation();
  const [ activeTab, setActiveTab ] = useState('overview');

  const tabs = [
    {
      title: t('landing.whatCanTabs.overview.title'),
      key: 'overview',
    },
    {
      title: t('landing.whatCanTabs.developers.title'),
      key: 'developers',
    },
    {
      title: t('landing.whatCanTabs.funders.title'),
      key: 'funders'
    }
  ];

  const renderHeroText = () => {
    const useSplitHeader = i18n.exists('landing.heroSecondary');

    if (useSplitHeader) {
      return (
        <div className="c-landing__split-wrapper">
          <h1 className="u-font-white u-text-uppercase u-display-inline-block">{t('landing.hero')}&nbsp;</h1>
          <h1 className="u-font-gold u-text-uppercase u-display-inline-block">{t('landing.heroSecondary')}</h1>
        </div>
      )
    } else {
      return (<h1 className="u-font-white u-text-uppercase u-text-center">{t('landing.hero')}</h1>)
    }
  }

  const renderHeader = (translationKey) => {
    if (t(translationKey).length > 0 && t(translationKey) !== " ") {
      return <h3 className="u-text-uppercase">{t(translationKey)}</h3>
    }
  }

  const renderParagraph = (translationKey) => {
    if (t(translationKey).length > 0 && t(translationKey) !== " ") {
      return <p>{t(translationKey)}</p>
    }
  }

  const emailAddress = process.env.REACT_APP_WRI_EMAIL_ADDRESS;
  const contactMailtoLink = `mailto:${emailAddress}?subject=${encodeURI(t("footer.contactSubject"))}`

  const partnerSlideConfig = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    centerMode: false,
    slidesToScroll: 4,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
    <article className="c-landing">
      <section className="c-landing__hero u-flex u-flex--column u-flex--centered">
        {renderHeroText()}
        <div>
          <Link to="/signup" onClick={() => {gaEvent({category: 'User', action: 'Clicked on "Request an account"'})}}>
            <Button variant="alternative" className="c-video-banner__action-button u-margin-small">
              {t('landing.request')}
            </Button>
          </Link>
          <a href="https://www.wri.org/terramatchdemo"
            target="_blank" rel="noopener noreferrer"
            onClick={() => {gaEvent({category: 'User', action: 'Clicked on "Schedule a demo"'})}}>
            <Button className="c-video-banner__action-button u-margin-small" variant="alternative">{t('landing.demo')}</Button>
          </a>
        </div>
      </section>
      <section className="c-section c-section--light">
        <div className="o-container u-flex u-flex--centered u-flex--break-md">
          <h2 className="u-text-uppercase u-font-huge">{t('landing.whatCan')}</h2>
        </div>
        <div className="u-flex u-flex--centered u-flex--break-md">
          <div className="o-flex-item o-flex-item--equal-basis o-flex-item--align-self-start c-landing__tab">
            <Tab items={tabs} tabChange={setActiveTab} activeTabKey={activeTab}/>
            <div className="c-tab__content u-padding-top-large">
              <div className="c-landing__tab-content u-text-pre-wrap">
                {renderHeader(`landing.whatCanTabs.${activeTab}.header1`)}
                {renderParagraph(`landing.whatCanTabs.${activeTab}.paragraph1`)}
                {renderHeader(`landing.whatCanTabs.${activeTab}.header2`)}
                {renderParagraph(`landing.whatCanTabs.${activeTab}.paragraph2`)}
              </div>
            </div>
          </div>
          <div className="o-flex-item--equal-basis u-text-center u-padding-tiny u-flex u-flex--column u-flex--centered">
            <img className="c-image c-image--responsive c-section__image"
              src={laptopMobileImage}
              srcSet={`${laptopMobileImage2x} 2x`}
              alt={t('landing.whatCanImage')}
            />
            <a href="https://www.wri.org/terramatch#2-pagers"
              target="_blank" rel="noopener noreferrer"
              className="c-button c-button--is-link-slim c-button--alternative u-text-center u-margin-small">
              {t('landing.pdfExplainer')}
            </a>
          </div>
        </div>
      </section>
      { (projectsArr || projectsArr.length > 0 ) &&
      <section className="c-section c-section--dark c-landing__news u-padding-horizontal-none u-padding-top-large u-padding-bottom-small">
        <SliderList
          items={projectsArr}
          variant="Featured"
          className="u-margin-bottom-small"
          isFetching={projectsArrLoading}
          langCode={i18n.language}
        />
      </section>
      }
      { false &&
      <section className="c-section c-section--light u-padding-none">
        <Map config={mapDefaultConfig} map={(map) => {
            L.marker([51.5, -0.09]).bindPopup("<b>Hello world!</b><br>I am a popup.").addTo(map);
          }}
          language={i18n.language}/>
      </section>
      }
    </article>
    <footer className="c-footer c-section c-section--light u-padding-vertical-large">
        <div className="o-container u-flex u-flex--centered u-flex--break-md">
          <div className="c-footer__left-section o-flex-item o-flex-item--equal-basis">
            <img src={Logo} alt="WRI logo" className="c-footer__logo u-margin-bottom-huge"></img>
            <h3 className="u-text-uppercase u-text-bold">{t('footer.title')}</h3>
            <p>{t('footer.body')}</p>
          </div>
          <div className="c-footer__right-section o-flex-item--equal-basis u-padding-vertical-large">
            <h3 className="u-text-uppercase u-text-bold">{t('landing.ourPartners')}</h3>
            <div className="c-partner-list u-margin-bottom-large">
              <SliderList items={partnerArr} slickConfig={partnerSlideConfig} variant="Partner"/>
            </div>
            <ul className="c-footer__links u-flex u-padding-none">
              <li className="c-list__item u-margin-right-small">
                <a href="https://wriorg.s3.amazonaws.com/s3fs-public/terra-match-terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer" className="u-link u-text-bold">{t('footer.terms')}</a>
              </li>
              <li className="c-list__item u-margin-horizontal-small">
                <a href="https://www.wri.org/about/privacy-policy" target="_blank" rel="noopener noreferrer" className="u-link u-text-bold">{t('footer.privacy')}</a>
              </li>
              <li className="c-list__item u-margin-horizontal-small">
                <a href={contactMailtoLink} className="u-link u-text-bold">{t('footer.contact')}</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
};

LandingPublic.propTypes = {
  testimonialArr: PropTypes.array.isRequired,
  mapDefaultConfig: PropTypes.object
};

LandingPublic.defaultProps = {
  mapDefaultConfig: {}
};

export default LandingPublic;
