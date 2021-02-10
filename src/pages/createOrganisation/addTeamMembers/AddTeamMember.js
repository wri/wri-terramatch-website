import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormWalkthrough from '../../../components/formWalkthrough/FormWalkthrough';
import { steps } from './addTeamMemberSteps';
import AddTeamMemberSuccess from '../../../components/addTeamMember/AddTeamMemberSuccess';
import { gaEvent } from '../../../helpers/';
import { Prompt } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AddTeamMember = (props) => {
  const { inviteUserState,
          inviteUser,
          clearInviteUser,
          fullPage,
          cancelOverrideFunction,
          successOverrideFunction } = props;

  const { t } = useTranslation();

  const [ addMemberState, setAddMemberState ] = useState({
    showAddMember: false,
    showMemberList: false,
    userData: null
  });

  // Users
  const [ addedUsers, setAddedUsers ] = useState([]);
  const [ isSuccess, setIsSuccess ]  = useState(false);
  const [ errors, setErrors ] = useState([]);


  useEffect(() => {
    // Enable navigation prompt
    window.onbeforeunload = function() {
        return true;
    };

    return () => {
      // Remove navigation prompt
      window.onbeforeunload = null;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addTeamMemberSuccess = {
    noPage: true,
    link: '/addDocumentAwards'
  };

  const onFormSubmit = (model) => {
    inviteUser(model);
  };

  const onAddAnotherMember = () => {
    setAddMemberState({
      ...addMemberState,
      showAddMember: false,
      showMemberList: false
    })
  };

  const onCancelMemberTypeSelection = () => {
    if (addedUsers.length > 0) {
      setAddMemberState({
        ...addMemberState,
        showMemberList: true
      })
    } else {
      if (cancelOverrideFunction) {
        cancelOverrideFunction()
      } else {
        finishTeamMemberAdd();
      }
    }
  }

  // Finish adding team member, force the main walkthrough selection to be visible
  // and then force success.
  const finishTeamMemberAdd = () => {
    if (successOverrideFunction) {
      successOverrideFunction()
    } else {
      setAddMemberState({
        ...addMemberState,
        showAddMember: false,
        showMemberList: false
      });
      setIsSuccess(true);
    }
  };

  // When creating or inviting a user is successful, add the response to the list of added users.
  useEffect(() => {
    const inviteUserSuccess = !inviteUserState.isFetching &&
                            inviteUserState.data &&
                            !inviteUserState.error;
    let userToAdd = null;

    if (inviteUserState.error &&
      inviteUserState.error.response &&
      inviteUserState.error.response.body &&
      inviteUserState.error.response.body.errors) {
      setErrors(inviteUserState.error.response.body.errors);
    }

    if (inviteUserSuccess) {
      userToAdd = {...inviteUserState.data};
      clearInviteUser();
      gaEvent({
        category: 'Team member',
        action: 'User invited'
      });
    }

    if (userToAdd) {
      setAddedUsers(users => [...users, ...[userToAdd]]);
      setAddMemberState(state => {
        return {
          ...state,
          showAddMember: false,
          showMemberList: true
        }
      });
    }
  }, [inviteUserState, clearInviteUser]);

  const classes = fullPage ? 'u-whole-page u-flex u-flex--centered u-flex--justify-centered' : '';

  return (
    <section className={classes}>
      <Prompt
        when={!isSuccess}
        message={t('common.changesNotSaved')}
      />
        <>
        {addMemberState.showMemberList ?
          <AddTeamMemberSuccess
            users={addedUsers}
            onAddAnotherMember={onAddAnotherMember}
            onNext={finishTeamMemberAdd}
            fullPage={fullPage}/>
          :
          <FormWalkthrough
            steps={steps}
            successOptions={addTeamMemberSuccess}
            isSuccess={isSuccess}
            onSubmit={onFormSubmit}
            onValidate={() => {}}
            onCancel={onCancelMemberTypeSelection}
            errors={errors}
            fullPage={fullPage}
          >
          </FormWalkthrough>}
        </>
    </section>
  );
};

AddTeamMember.props = {
  fullPage: PropTypes.bool
};

AddTeamMember.defaultProps = {
  fullPage: true
};

export default AddTeamMember;
