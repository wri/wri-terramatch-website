import React from 'react';
import { useTranslation } from 'react-i18next';

const PageNotFound = (props) => {
  const { t } = useTranslation();
  return (
    <section className="c-backdrop c-backdrop--opaque c-backdrop--has-background u-flex u-flex--justify-centered u-flex-centered u-flex--column u-text-center">
      <h1 className="u-text-white u-font-xmassive u-margin-none">404</h1>
      <p className="u-text-white u-text-uppercase u-text-bold u-font-primary u-font-medium u-margin-none">{t('pageNotFound.notFound')}</p>
      <p className="u-text-white u-font-primary u-font-normal u-margin-top-tiny">{t('pageNotFound.notFoundHelp')}</p>
    </section>
  );
};

export default PageNotFound;
