import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCookies } from "react-cookie";
import { Button } from 'tsc-chameleon-component-library';

const CookieBanner = (props) => {

  const [cookies, setCookie] = useCookies();
  const { t } = useTranslation();

  const acceptCookies = () => {
    // ensure the cookie expires one year from now
    const secondsInYear = 31536000;
    setCookie("cookieConsent", true, { maxAge: secondsInYear });
  }

  // don’t show if user has the cookie
  if(cookies.cookieConsent) {
    return (<></>);
  } else {
    return (
      <div className="c-cookie-banner u-flex u-flex--centered u-flex--justify-centered u-flex--break-md">
        <p className="u-text-center">
          <Trans
            i18nKey="landing.cookieBanner.notice"
            components={[
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a className="u-font-gold u-text-decoration-none" target="_blank" rel="noopener noreferrer" href="https://www.wri.org/about/privacy-policy" />
            ]}
          />
          <Button variant="alternative" click={acceptCookies}>{t('common.ok')}</Button>
        </p>
      </div>
    )
  }
}

export default CookieBanner;