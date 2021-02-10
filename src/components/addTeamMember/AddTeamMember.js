import React from 'react';
import { steps as inviteUserSteps } from './teamMemberSteps';
import FormWalkthrough from '../formWalkthrough/FormWalkthrough';

const AddTeamMember = (props) => {
  const { inviteUserState,
          onTeamMemberAdd,
          onCancelMemberAdd,
          fullPage } = props;

  let inviteUserErrors = [];

  if (inviteUserState.error &&
      inviteUserState.error.response &&
      inviteUserState.error.response.body &&
      inviteUserState.error.response.body.errors) {
        inviteUserErrors = inviteUserState.error.response.body.errors;
  }

  return (
    <FormWalkthrough
      steps={inviteUserSteps}
      onSubmit={onTeamMemberAdd}
      onValidate={() => {}}
      errors={inviteUserErrors}
      onCancel={onCancelMemberAdd}
      isFetching={inviteUserState.isFetching}
      fullPage={fullPage}
    />
  )
}

export default AddTeamMember;
