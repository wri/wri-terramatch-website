import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'tsc-chameleon-component-library';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';

const VerifyUser = (props) => {
  const { location, searchQuery, verify, verifyState, meState } = props;
  const { t } = useTranslation();
  const query = location.search.length > 0 ? location.search : searchQuery;
  const token = qs.parse(query).token;
  const userVerified = meState.data.email_address_verified_at;
  const isVerified = verifyState.lastSuccessTime > 0 || userVerified;

  if (!userVerified && token && !verifyState.error && !verifyState.lastFetchTime) {
    verify(token);
  }

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      {verifyState.error && token &&
        <div className="u-text-center">
          <h1>{t('verify.problem')}</h1>
          <p>{t('verify.checkEmailInvalid')}</p>
        </div>
      }

      {!token ?
        <div className="u-text-center">
          <h1>{t('verify.problem')}</h1>
          <p>{t('verify.checkEmail')}</p>
        </div>
        :
        !verifyState.error &&
        <div className="u-overlay u-overlay--light u-flex u-flex--centered u-flex--justify-centered">
          <h1 className="u-margin-right-small">{t('verify.verifying')}</h1><Loader />
        </div>
      }

      {isVerified && meState.data.email_address_verified_at && meState.data.organisation_id &&
          <Redirect to={{pathname: '/'}} />
      }

      {isVerified && meState.data.email_address_verified_at && !meState.data.organisation_id &&
          <Redirect to={{pathname: '/createOrganisation'}} />
      }

      {isVerified && meState.data.email_address_verified_at && meState.data.role === 'admin' &&
          <Redirect to={{pathname: '/admin'}} />
      }
    </section>
  );
};

VerifyUser.propTypes = {
  location: PropTypes.object.isRequired,
  searchQuery: PropTypes.string.isRequired,
  verify: PropTypes.func.isRequired,
  verifyState: initialAsyncStatePropType.isRequired,
  meState: initialAsyncStatePropType.isRequired,
};

export default VerifyUser;
