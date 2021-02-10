import React from 'react';
import { Backdrop } from 'tsc-chameleon-component-library';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Unsubscribe = () => {
  const { t } = useTranslation();

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      <div className="c-form-container">
        <div className="c-form-container__content u-text-center u-margin-vertical-small">
          <h1>{t('unsubscribe.title')}</h1>
          <p className="u-margin-bottom-large">{t('unsubscribe.subtext')}</p>
          <Link className="c-button c-button--is-link" to="/">{t('signup.successLinkText')}</Link>
        </div>
      </div>
      <Backdrop show opaque className="c-backdrop--has-background"/>
    </section>
  );
};

export default Unsubscribe;
