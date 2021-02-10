import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'tsc-chameleon-component-library';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import { getUsersName, getUserKey, getArrayOfTeamMembers, canFetch } from '../../helpers';
import MemberListItemCard from '../memberList/MemberListItemCard';

const ProjectContacts = (props) => {

  const {
    projectId,
    orgId,
    isEditing,
    contacts,
    createContactState,
    deleteContactState,
    teamMembers,
    getContacts,
    getTeamMembers,
    createContacts,
    deleteContact,
    clearCreateContacts,
    clearDeleteContact,
    clearState,
  } = props;

  const { t } = useTranslation();
  const [ addModal, setAddModal ] = useState(false);
  const [ userToRemove, setUserToRemove ] = useState(null);
  const [ selectedUsers, setSelectedUsers ] = useState([]);
  const [ availableTeamMembers, setAvailableTeamMembers ] = useState([]);

  useEffect(() => {
    if (canFetch(contacts)) {
      getContacts(projectId);
    }
  }, [getContacts, contacts, projectId])

  useEffect(() => {
    clearState();
    getTeamMembers(orgId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const teamMemberExistsInContacts = useCallback((teamMember) => {
    if (teamMember.type === "user") {
      return contacts.data.some(contact => (contact.user_id === teamMember.id));
    } else {
      return contacts.data.some(contact => (contact.team_member_id === teamMember.id));
    }
  }, [contacts])

  useEffect(() => {
    if (teamMembers.data && contacts.data) {
      const available = teamMembers.data
      .filter(teamMember => teamMemberExistsInContacts(teamMember) === false)
      .filter(teamMember => (teamMember.role !== 'user' && !teamMember.email_address_verified_at))

      setAvailableTeamMembers(available);
    }

  }, [contacts, teamMemberExistsInContacts, teamMembers]);

  useEffect(() => {
    if (createContactState.data && createContactState.lastSuccessTime > 0) {
      clearCreateContacts();
      setAddModal(false);
      getContacts(projectId);
    }
  }, [clearCreateContacts, createContactState, getContacts, projectId]);

  useEffect(() => {
    if (deleteContactState && deleteContactState.lastSuccessTime > 0) {
      clearDeleteContact();
      setUserToRemove(null);
      getContacts(projectId);
    }
  }, [clearDeleteContact, deleteContactState, getContacts, projectId]);

  const onRemove = (user) => {
    setUserToRemove(user);
  };

  const onAdd = () => {
    setSelectedUsers([]);
    getTeamMembers(orgId);
    setAddModal(true);
  }

  const onUpdateContacts = () => {
    const toCreate = getArrayOfTeamMembers(selectedUsers);
    createContacts(toCreate, projectId);
  }

  const confirmDeleteClick = () => {
    deleteContact(userToRemove.id);
  }

  const valueChange = (value) => {
    const values = [...selectedUsers];
    const index = values.indexOf(value);

    if (index > -1) {
      values.splice(index, 1);
    } else {
      values.push(value);
    }
    setSelectedUsers(values);
  }


  return (
    <section className="c-section c-section--standard-width">
      <ul className='u-text-center c-add-users__list u-margin-vertical-large' id="-users">
        {
          contacts && contacts.data && contacts.data
          .map(Contact => {
            const key = getUserKey(Contact);

            return <MemberListItemCard
                    key={key}
                    user={Contact}
                    canDelete={isEditing && contacts.data.length > 1}
                    onRemove={onRemove}
                  />
          })
        }
      </ul>
      {isEditing &&
        (
          (availableTeamMembers.length > 0) &&
          <div className="c-section c-section--thin-width u-text-center">
            <Button variant="outline" click={onAdd}>{t('addTeamMember.details.title')}</Button>
          </div>
        )
      }
      {userToRemove &&
        <Modal show close={() => setUserToRemove(null)}>
          <div className="u-text-center">
            <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('addTeamMember.details.removeTeamMember')}</h2>
            <p>{t('addTeamMember.details.removeTeamMemberHelp',
                {
                  name: getUsersName(userToRemove)
                })}</p>
            <ul className="c-add-users__list">
              <MemberListItemCard user={userToRemove} />
            </ul>
            <Button
              click={confirmDeleteClick}
              disabled={false}>
              {false ? t('common.removing') : t('common.remove')}
            </Button>
          </div>
        </Modal>
      }
      {addModal &&
        <Modal show close={() => setAddModal(false)}>
          <div className="u-text-center">
            <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">
              {t('createPitch.details.projectTeam')}
            </h2>
            <p>
              {t('createPitch.details.projectTeamHelp')}
            </p>
          </div>

          <ul className={'u-text-center c-add-users__list u-margin-vertical-large'}>
            {
              availableTeamMembers
              .map(teamMember => {

                const key = getUserKey(teamMember);

                return <MemberListItemCard
                        key={key}
                        user={teamMember}
                        isSelectable
                        isCompact
                        onSelectChange={valueChange}
                        isSelected={selectedUsers.findIndex(selected => selected === teamMember) > -1}
                        selectedUsers={selectedUsers}
                      />
              })
            }
          </ul>
          <div className="u-flex u-flex--space-between">
            <Button
              variant="secondary"
              click={() => setAddModal(false)}
              disabled={false}>
              {t('common.cancel')}
            </Button>
            <Button
              click={onUpdateContacts}
              disabled={selectedUsers.length === 0}>
              {false ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </Modal>
      }
    </section>
  );
};

ProjectContacts.propTypes = {
  ProjectId: PropTypes.number.isRequired,
  orgId: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  deleteContactState: initialAsyncStatePropType.isRequired,
  createContactState: initialAsyncStatePropType.isRequired,
  contacts: initialAsyncStatePropType.isRequired,
  teamMembers: initialAsyncStatePropType.isRequired,
  getContacts: PropTypes.func.isRequired,
  createContacts: PropTypes.func.isRequired,
  getTeamMembers: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
  clearCreateContacts: PropTypes.func.isRequired,
  clearDeleteContact: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired
}

export default ProjectContacts;
