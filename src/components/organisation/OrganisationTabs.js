import React from 'react';
import About from './AboutContainer';
import Projects from './ProjectsContainer';
import TeamMembers from './TeamMembersContainer';
import Documents from './DocumentsContainer';
import Tab from '../tab/Tab';
import { useTranslation } from 'react-i18next';

const OrganisationTabs = (props) => {
  const { t } = useTranslation();
  const { organisation,
          isEditing,
          organisationUpdate,
          errors,
          pitches,
          offers,
          meState,
          isMyOrganisation,
          isAdmin,
          teamMembers,
          documents,
          fetchTeamMembers,
          setActiveTab,
          activeTab,
          fetchExtras } = props;

  const tabs = [
    {
      title: t('organisation.about'),
      key: 'about',
    },
    {
      title: t('organisation.pitches'),
      key: 'pitches',
      shouldHide: organisation.data.category === 'funder'
    },
    {
      title: t('organisation.offers'),
      key: 'offers',
      shouldHide: organisation.data.category === 'developer'
    },
    {
      title: t('organisation.team'),
      key: 'team'
    },
    {
      title: t('organisation.documents'),
      key: 'documents'
    }
  ];

  let activeTabComponent = null;

  switch(activeTab) {
    case 'about':
      activeTabComponent = <About
        organisation={organisation}
        editMode={isEditing}
        onChange={organisationUpdate}
        errors={errors}/>
      break;
    case 'pitches':
      activeTabComponent = <Projects
        projects={pitches}
        organisation={organisation}
        editMode={isEditing}
        fetchExtras={fetchExtras}
        isMyOrganisation={isMyOrganisation}/>
      break;
    case 'offers':
      activeTabComponent = <Projects
        projects={offers}
        organisation={organisation}
        editMode={isEditing}
        fetchExtras={fetchExtras}
        isOffer={true}
        isMyOrganisation={isMyOrganisation}/>
      break;
    case 'team':
      activeTabComponent = <TeamMembers
        teamMembersState={teamMembers}
        isMyOrganisation={isMyOrganisation}
        isAdmin={isAdmin}
        editMode={isEditing}
        fetchTeamMembers={fetchTeamMembers}
        meState={meState} />
      break;
    case 'documents':
      activeTabComponent = <Documents
        documents={documents}
        editMode={isEditing}
        organisation={organisation} />
      break;
    default:
      break;
  }

  return (
    <>
      <Tab items={tabs} tabChange={setActiveTab} activeTabKey={activeTab}/>
      <div className="c-tab__content">
        {activeTabComponent}
      </div>
    </>
  );
}

export default OrganisationTabs;
