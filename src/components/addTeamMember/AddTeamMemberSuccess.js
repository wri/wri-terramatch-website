import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'tsc-chameleon-component-library';
import MemberList from '../memberList/MemberList';
import FormWalkthrough from '../formWalkthrough/FormWalkthrough';
import successTick from '../../assets/images/icons/tick-icon.png';
import { getSteps as getAddedSuccessSteps } from './addTeamMemberSuccessSteps';
import { getUsersName } from '../../helpers';

const AddTeamMemberSuccess = (props) => {
  const { users, onAddAnotherMember, onNext, fullPage } = props;
  const { t } = useTranslation();

  const lastUserIndex = users.length - 1;
  const lastUserName = users[lastUserIndex] ? getUsersName(users[lastUserIndex]) : '';
  const successSteps = getAddedSuccessSteps(lastUserName);

  return (
    <FormWalkthrough
      steps={successSteps}
      onSubmit={onNext}
      onValidate={() => {}}
      errors={[]}
      icon={successTick}
      fullPage={fullPage}
    >
      <MemberList users={users} />
      <Button variant="outline" click={onAddAnotherMember} className="u-margin-vertical-small">{t('addTeamMember.addAnother')}</Button>
    </FormWalkthrough>
  );
};

export default AddTeamMemberSuccess;
