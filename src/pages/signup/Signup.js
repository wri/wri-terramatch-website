import React, { useEffect } from 'react';
import FormWalkthrough from '../../components/formWalkthrough/FormWalkthrough';
import steps from './steps';
import qs from 'query-string';
import { getRawResponseErrors, gaEvent } from '../../helpers';

export default (props) => {
  const signupSuccess = {
    text: 'signup.success',
    linkText: 'signup.successLinkText',
    link: '/'
  };

  const {
    signup,
    signupState,
    clearSignup,
    location,
    acceptAdminInvite,
    acceptAdminInviteState,
    acceptUserInvite,
    acceptUserInviteState,
    history
  } = props;

  useEffect(() => {
    return clearSignup
  }, [clearSignup]);

  const query = location.search.length > 0  && location.search;
  let emailAddress = null;
  let type = 'user';

  if (query) {
    let parsedQuery = qs.parse(query)
    emailAddress = parsedQuery.emailAddress;
    if (parsedQuery.type === 'admin') {
      type = 'admin';
    }
  }

  const isInvite = !!emailAddress;

  const onFormSubmit = (model) => {
    if (isInvite) {
      model.email_address = emailAddress;
      if (type === 'admin') {
        acceptAdminInvite(model);
      } else {
        acceptUserInvite(model);
      }
    } else {
      signup(model);
    }
  }

  let errors = [];

  if (!isInvite) {
    errors = getRawResponseErrors(signupState);
  } else if (isInvite && type === 'admin') {
    errors = getRawResponseErrors(acceptAdminInviteState);
  } else if (isInvite) {
    errors = getRawResponseErrors(acceptUserInviteState);
  }

  if (isInvite) {
    // We're accepting an invite. Remove the emailAddress step (adding before we submit)
    let index = steps[0].fields.findIndex((field) => field.modelKey === 'email_address');

    if (index > -1) {
      steps[0].fields.splice(index, 1);
    }

    if (type === 'admin') {
      index = steps[0].fields.findIndex((field) => field.modelKey === 'phone_number');

      if (index > -1) {
        steps[0].fields.splice(index, 1);
      }
    }
  }

  useEffect(() => {
    if (signupState.lastSuccessTime > 0) {
      gaEvent({
        category: 'User Registration',
        action: 'User completed'
      });
    }
  }, [signupState]);

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      <FormWalkthrough
        modelName="UserCreate"
        steps={steps}
        successOptions={signupSuccess}
        onSubmit={onFormSubmit}
        onCancel={() => { history.goBack(); }}
        onValidate={clearSignup}
        isFetching={isInvite ? (acceptAdminInviteState.isFetching || acceptUserInviteState.isFetching)
                             : signupState.isFetching}
        isSuccess={isInvite ? (!!acceptAdminInviteState.data || !!acceptUserInviteState.data)
                            : !!signupState.data}
        errors={errors}
        showProgress={false}
      />
    </section>
  );
};
