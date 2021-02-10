import React, { useState, useRef, useEffect } from 'react';
import { Backdrop } from 'tsc-chameleon-component-library';
import { AuthChange } from 'wrm-api';
import { Loader } from 'tsc-chameleon-component-library';
import { useTranslation } from 'react-i18next'
import FormInput from '../../components/formInput/FormInput';
import { getRawResponseErrors } from '../../helpers';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

const ResetForm = props => {
    const { changePassword, changePasswordState, token, clearState } = props;
    const [ changeDetails, setChangeDetails ] = useState(new AuthChange());
    const [ passwordChanged, setPasswordChanged ] = useState(false);
    const [ repeatPassword, setRepeatPassword ] = useState('');
    const [ errors, setErrors ] = useState([]);

    const { t } = useTranslation();
    const formEl = useRef(null);

    useEffect(() => {
      clearState();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      let newErrors = [...getRawResponseErrors(changePasswordState)];

      if (changeDetails.password !== repeatPassword &&
          changeDetails.password && changeDetails.password.length > 0
          && repeatPassword.length > 0) {
        newErrors.push({
          source: 'repeat_password',
          code: 'REPEAT'
        })
      }

      setErrors(newErrors);
    }, [changeDetails.password, changePasswordState, repeatPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await changePassword(changeDetails);

        // will only get called on success, as await will throw exception
        setPasswordChanged(true);
    }

    if (passwordChanged) {
        return (
            <>
              <h1>{t('reset.changeSuccess')}</h1>
              <Link className="c-button c-button--is-link" to="/">{t('signup.successLinkText')}</Link>
            </>
        );
    }

    return (
        <form ref={formEl} onSubmit={handleSubmit}>
            <h1>{t('reset.reset')}</h1>
            <FormInput
                className="u-margin-bottom-small"
                id="text-password-example"
                label={t('reset.newPasswordLabel')}
                placeholder={t('reset.newPasswordLabel')}
                value={changeDetails.password}
                onChange={(e) => setChangeDetails({token, password: e.target.value})}
                type="password"
                autocomplete="new-password"
                required
            />
            <FormInput
                className="u-margin-bottom-small"
                id="text-password-example"
                label={t('signup.repeatPassword')}
                placeholder={t('signup.repeatPassword')}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                type="password"
                autocomplete="new-password"
                required
                errors={errors}
            />
          <input
            type="submit"
            className="c-button u-width-100"
            value={t('reset.reset')}
            disabled={repeatPassword !== changeDetails.password}/>
        </form>
    );
};

const PasswordReset = props => {

    const { location, changePasswordState } = props;
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (!token) {
      return (<Redirect to='/' />);
    }

    return (
        <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
            <div className="c-form-container">
                <div className="c-form-container__content u-text-center u-margin-vertical-small">
                    {
                        token &&
                        <ResetForm token={token} {...props} />
                    }
                    {
                        changePasswordState.isFetching && (
                            <div className="u-overlay u-overlay--light u-flex u-flex--centered u-flex--justify-centered">
                               <Loader />
                            </div>
                        )
                    }
                </div>
            </div>
            <Backdrop show opaque className="c-backdrop--has-background"/>
        </section>
    )
}

export default PasswordReset;
