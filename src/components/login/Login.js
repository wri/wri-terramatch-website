import React, { useState, useRef } from 'react';
import { Loader, Button } from 'tsc-chameleon-component-library';
import PropTypes from 'prop-types';
import FormInput from '../formInput/FormInput';
import { useTranslation } from 'react-i18next';
import { AuthLogIn } from 'wrm-api';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import { gaEvent } from '../../helpers';

const Login = (props) => {
  const {
    login,
    getMe,
    loginState,
    meState,
    className,
    loginRedirect,
    history,
    hideLoginModal,
    onLogin,
    requestReset,
    requestResetState
  } = props;

  const { t } = useTranslation();

  const [ showPasswordReset, setShowPasswordReset ] = useState(false);
  const [ passwordResetSuccess, setPasswordResetSuccess ] = useState(false);
  const [ loginDetails, setloginDetails ] = useState(new AuthLogIn());

  const formEl = useRef(null);
  let errors = {};

  const handleSubmit = async (e) => {
    gaEvent({category: 'User', action: 'Clicked on "Sign in"'})
    e.preventDefault();
    await login(loginDetails);
    await getMe();
    history.push(loginRedirect);
    hideLoginModal();
    onLogin();
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const { email_address } = loginDetails;
    await requestReset({ email_address });
    setPasswordResetSuccess(true);
  };

  const togglePasswordReset = () => {
    setShowPasswordReset(!showPasswordReset);
    setPasswordResetSuccess(false);
  };

  if (loginState.error) {
    if (loginState.error.status === 401) {
      // Incorrect login details
      errors['password'] = t('login.errors.incorrectDetails');
    }

    if (loginState.error.response && loginState.error.response.body && loginState.error.response.body.errors) {
      for (let i in loginState.error.response.body.errors) {
        const error = loginState.error.response.body.errors[i];
        errors[error.source] = error.detail;
      }
    }

    if (loginState.error && !loginState.error.response) {
      errors['password'] = t('login.errors.problem');
    }
  }

  const passwordResetForm = () => (
    <form ref={formEl} onSubmit={handleResetSubmit}>
      {!passwordResetSuccess ?
        <>
          <FormInput
            className="u-margin-bottom-small"
            id="text-email-example"
            label={t('login.emailLabel')}
            value={loginDetails.email_address}
            onChange={(e) => setloginDetails({...loginDetails, email_address: e.target.value})}
            placeholder={t('login.emailLabel')}
            type="email"
            autocomplete="email"
            required
            errorText={errors['email_address'] ? errors['email_address'] : ""}
          />
          <input type="submit" className="c-button" value={t('reset.reset')} />
        </> :
        <p>{t('reset.resetSuccess')}</p>
      }
      <div className="u-text-right u-margin-top-small">
        <Button variant="link" click={togglePasswordReset}>{t('login.login')}</Button>
      </div>
    </form>
  );

  const loginForm = () => (
    <form ref={formEl} onSubmit={handleSubmit} data-testid="test-login-form">
      <FormInput
        className="u-margin-bottom-small"
        id="text-email-example"
        label={t('login.emailLabel')}
        value={loginDetails.email_address}
        onChange={(e) => setloginDetails({...loginDetails, email_address: e.target.value})}
        placeholder={t('login.emailLabel')}
        type="email"
        autocomplete="email"
        required
        errorText={errors['email_address'] ? errors['email_address'] : ""}
      />

      <FormInput
        className="u-margin-bottom-small"
        id="text-password-example"
        label={t('login.passwordLabel')}
        placeholder={t('login.passwordLabel')}
        value={loginDetails.password}
        onChange={(e) => setloginDetails({...loginDetails, password: e.target.value})}
        type="password"
        autocomplete="current-password"
        required
        errorText={errors['password'] ? errors['password'] : ""}
      />

      <input type="submit" className="c-button" value={t('login.login')} />
      <div className="u-text-right u-margin-top-small">
        <Button variant="link" click={togglePasswordReset}>{t('reset.reset')}</Button>
      </div>
    </form>
  );

  return (
    <div className={className}>
      {
        showPasswordReset ? passwordResetForm() : loginForm()
      }
      {(loginState.isFetching || meState.isFetching || requestResetState.isFetching) && (
        <div className="u-overlay u-overlay--light u-flex u-flex--centered u-flex--justify-centered">
          <Loader />
        </div>
      )}
    </div>
  );
};

Login.propTypes = {
  loginState: initialAsyncStatePropType.isRequired,
  meState: initialAsyncStatePropType.isRequired,
  requestResetState: initialAsyncStatePropType.isRequired,
  loginRedirect: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  requestReset: PropTypes.func.isRequired,
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  hideLoginModal: PropTypes.func.isRequired,
  onLogin: PropTypes.func,
  getMe: PropTypes.func.isRequired
};

Login.defaultProps = {
  className: '',
  onLogin: () => {}
};

export default Login;
