import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FormElement from '../../../components/formWalkthrough/FormElement';
import FORM_TYPES from '../../../components/formInput/FormInputTypes';
import { initialAsyncStatePropType } from '../../../redux/asyncActionReducer';
import { Loader, Button } from 'tsc-chameleon-component-library';
import { getResponseErrors } from '../../../helpers/errors';
import PanelItem from '../../../components/panelItem/PanelItem';
import LoadingSection from '../../../components/loading/LoadingSection';

const AdminUserList = (props) => {
  const { t } = useTranslation();
  const [ newEmail, setNewEmail ] = useState('');
  const [ errors, setErrors ] = useState({});
  const { getAdmins, getAdminsState, inviteAdmin, inviteAdminState } = props;

  if (!getAdminsState.data && !getAdminsState.error && !getAdminsState.isFetching) {
    getAdmins();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    inviteAdmin(newEmail);
    setNewEmail('');
  };

  useEffect(() => {
    setErrors(getResponseErrors(inviteAdminState));
  }, [inviteAdminState]);

  const admins = getAdminsState.data ?
    getAdminsState.data.map((admin) => {
      return (
        <PanelItem key={admin.email_address} className="u-flex u-flex--space-between u-flex--break-md u-margin-bottom-small u-flex--centered c-admin__panel-item">
          <div>
            <h3 className="u-text-uppercase u-text-bold u-text-spaced-small u-margin-bottom-none u-font-grey">
              {admin.first_name} {admin.last_name}
            </h3>
            <p className="u-font-primary u-margin-none u-font-grey u-text-spaced-small">
              {admin.email_address}
            </p>
            {!admin.email_address_verified_at &&
            <p className="u-font-small u-font-primary u-margin-none">
              {t('addTeamMember.details.awaitingConfirmation')}
            </p>}
          </div>
        </PanelItem>
      );
    })
   : []

  return (
    <section className="c-section c-section--standard-width">
      <h1 className="u-text-uppercase">{t('admin.users.title')}</h1>
      {getAdminsState.isFetching ? <LoadingSection /> :
        <>
          <Button click={getAdmins} className="c-button--small u-margin-bottom-small">{t('common.refresh')}</Button>
          <h2 className="u-text-uppercase u-font-normal">{t('admin.users.currentAdmins')}</h2>

          {admins}
        </>
      }
      <h2 className="u-text-uppercase u-font-normal">{t('admin.users.addNewAdmin')}</h2>
      {inviteAdminState.isFetching ?
        <Loader className="u-margin-tiny"/> :
        <form onSubmit={handleSubmit} className="c-section c-section--thin-width c-section--card u-padding-bottom-large">
          <FormElement
            field={{
              modelKey: 'email_address',
              label: 'signup.emailAddress',
              type: FORM_TYPES.email,
              required: true,
              showLabel: true
            }}
            errors={errors}
            model={{email_address: newEmail}}
            onFieldChange={e => setNewEmail(e.target.value)}
          />
          <input type="submit"
            className="c-button c-button--small u-margin-tiny u-float-right"
            value={t('admin.users.addAdmin')}
            disabled={inviteAdminState.isFetching}
          />
        </form>
      }
      {inviteAdminState.lastSuccessTime > 0 &&
        <p>{t('admin.users.invitedAdmin', { email: inviteAdminState.data.email_address })}</p>
      }
    </section>)
};

AdminUserList.propTypes = {
  getAdmins: PropTypes.func.isRequired,
  getAdminsState: initialAsyncStatePropType.isRequired,
  inviteAdmin: PropTypes.func.isRequired,
  inviteAdminState: initialAsyncStatePropType.isRequired
}

export default AdminUserList;
