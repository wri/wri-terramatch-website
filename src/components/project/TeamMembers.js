import React from 'react';
import { useTranslation } from 'react-i18next';
import TeamMemberList from '../../components/memberList/MemberList';

const TeamMembers = (props) => {
  const { teamMembersState } = props;
  const { t } = useTranslation();

  return (
    <section className="c-section c-section--standard-width">
      <div className="c-section c-section--thin-width">
        <h2>{t('organisation.team')}</h2>
      </div>
      <TeamMemberList
        isMyOrganisation={false}
        users={teamMembersState.data ? teamMembersState.data : []}
        showAccountStatus={false}
        isCard
      />
    </section>
  );
};

export default TeamMembers;
