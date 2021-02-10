import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import TeamMemberList from '../../components/memberList/MemberList';
import AddTeamMember from '../../pages/createOrganisation/addTeamMembers/AddTeamMemberContainer';
import { Button, Modal } from 'tsc-chameleon-component-library';
import { getUsersName, getResponseErrors } from '../../helpers';
import MemberListItemCard from '../memberList/MemberListItemCard';
import FormInput from '../formInput/FormInput';
import FormTypes from '../formInput/FormInputTypes';

const TeamMembers = (props) => {
  const { teamMembersState,
          isMyOrganisation,
          editMode,
          fetchTeamMembers,
          removeTeamMemberState,
          removeTeamMember,
          clearRemoveTeamMember,
          isAdmin,
          meState,
          patchUser,
          patchUserState,
          patchTeamMember,
          patchTeamMemberState,
          clearPatches,
          uploadAvatarState,
          uploadAvatar,
          clearUpload } = props;

  const { t } = useTranslation();
  const [ isModal, setIsModal ] = useState(false);
  const [ userToRemove, setUserToRemove ] = useState(null);
  const [ userToEdit, setUserToEdit ] = useState(null);
  const [ userEditErrors, setUserEditErrors ] = useState({});
  const [ uploadErrors, setUploadErrors ] = useState({});
  const [ avatarFileName, setAvatarFileName ] = useState('');
  const canSeeDetails = isMyOrganisation || isAdmin;

  const onAddNewTeamMembers = () => {
    fetchTeamMembers();
    setIsModal(false);
  };

  const onUserEditChange = (value, key) => {
    if (key === 'avatar') {
      const file = value.files[0];
      if (file) {
        clearUpload();
        setUploadErrors({});
        uploadAvatar({file});
        setAvatarFileName(file.name);
      }
    } else {
      let newUser = {...userToEdit}
      newUser[key] = value;
      setUserToEdit(newUser);
    }
  };

  useEffect(() => {
    if (!removeTeamMemberState.isFetching && removeTeamMemberState.lastSuccessTime > 0) {
      setUserToRemove(null);
      clearRemoveTeamMember();
      fetchTeamMembers();
    }
  }, [clearRemoveTeamMember, fetchTeamMembers, removeTeamMemberState]);

  const resetEdit = useCallback(() => {
    setUserToEdit(null);
    setUserEditErrors({});
    setUploadErrors({});
    clearPatches();
    clearUpload();
    fetchTeamMembers();
  }, [clearPatches, clearUpload, fetchTeamMembers]);

  useEffect(() => {
    if (!patchUserState.isFetching && patchUserState.lastSuccessTime > 0) {
      resetEdit();
    }
    if (patchUserState.error) {
      setUserEditErrors(getResponseErrors(patchUserState));
    }
  }, [clearPatches, fetchTeamMembers, patchUserState, resetEdit]);

  useEffect(() => {
    if (!patchTeamMemberState.isFetching && patchTeamMemberState.lastSuccessTime > 0) {
      resetEdit();
    }
    if (patchTeamMemberState.error) {
      setUserEditErrors(getResponseErrors(patchTeamMemberState));
    }
  }, [clearPatches, fetchTeamMembers, patchTeamMemberState, resetEdit]);

  useEffect(() => {
    if (uploadAvatarState.error) {
      setUploadErrors(getResponseErrors(uploadAvatarState));
    }
  }, [uploadAvatarState]);

  const submitEditForm = (e) => {
    e.preventDefault();
    if (userToEdit.type === 'user') {
      patchUser(userToEdit, uploadAvatarState);
    }
    if (userToEdit.type === 'teamMember') {
      patchTeamMember(userToEdit, uploadAvatarState);
    }
  };

  return (
    <>
      <section className="c-section c-section--standard-width u-padding-top">
        <TeamMemberList
          isMyOrganisation={isMyOrganisation}
          users={!teamMembersState.isFetching && teamMembersState.data ? teamMembersState.data : []}
          showAccountStatus={false}
          isCard
          canSeeDetails={canSeeDetails}
          canDelete={editMode || isMyOrganisation}
          onRemove={setUserToRemove}
          canEdit={isMyOrganisation}
          onEdit={(user) => setUserToEdit(JSON.parse(JSON.stringify(user)))}
          myUserId={meState.data ? meState.data.id : null}
        />
      {editMode &&
        <div className="c-section c-section--thin-width u-text-center">
          <Button variant="outline" click={() => setIsModal(true)}>{t('addTeamMember.details.title')}</Button>
        </div>
      }
      {isModal &&
        <AddTeamMember
          cancelOverrideFunction={() => setIsModal(false)}
          successOverrideFunction={onAddNewTeamMembers}/>
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
              click={() => {removeTeamMember(userToRemove.id)}}
              disabled={removeTeamMemberState.isFetching}>
              {removeTeamMemberState.isFetching ? t('common.removing') : t('common.remove')}
            </Button>
          </div>
        </Modal>
      }

      {userToEdit &&
        <Modal show close={resetEdit}>
          <div className="u-text-center">
            <h2 className="u-margin-bottom-small u-margin-top-none u-font-medium u-text-uppercase">
              {userToEdit.type === 'teamMember' ? t('addTeamMember.details.editTeamMember') : t('addTeamMember.details.editProfile') }
            </h2>

            <form onSubmit={submitEditForm} className="u-padding-horizontal-small">
              <FormInput
                id="first_name"
                label={t('signup.firstName')}
                showLabel
                type={FormTypes.text}
                value={userToEdit.first_name}
                onChange={e => {onUserEditChange(e.currentTarget.value, 'first_name')}}
                errors={userEditErrors["first_name"]}
                className="u-margin-bottom-small"
                required
              />
              <FormInput
                id="last_name"
                label={t('signup.lastName')}
                showLabel
                type={FormTypes.text}
                value={userToEdit.last_name}
                onChange={e => {onUserEditChange(e.currentTarget.value, 'last_name')}}
                errors={userEditErrors["last_name"]}
                className="u-margin-bottom-small"
                required
              />
              <FormInput
                id="email_address"
                label={t('signup.emailAddress')}
                showLabel
                type={FormTypes.email}
                value={userToEdit.email_address}
                onChange={e => {onUserEditChange(e.currentTarget.value, 'email_address')}}
                errors={userEditErrors["email_address"]}
                className="u-margin-bottom-small"
                disabled={userToEdit.type === 'user'}
                required
              />
              <FormInput
                id="job_role"
                label={t('signup.jobRole')}
                showLabel
                type={FormTypes.text}
                value={userToEdit.job_role}
                onChange={e => {onUserEditChange(e.currentTarget.value, 'job_role')}}
                errors={userEditErrors["job_role"]}
                className="u-margin-bottom-small"
                required
              />
              <FormInput
                id="phone_number"
                label={t('signup.phoneNumber')}
                showLabel
                type={FormTypes.tel}
                value={userToEdit.phone_number}
                onChange={e => {onUserEditChange(e.currentTarget.value, 'phone_number')}}
                errors={userEditErrors["phone_number"]}
                className="u-margin-bottom-small"
                required
              />
              <FormInput className="u-margin-bottom-small"
                          id="avatar"
                          showLabel
                          label={t('common.avatar')}
                          type={FormTypes.file}
                          accept={FormTypes.fileTypes.image}
                          uploadState={uploadAvatarState}
                          onChange={(e) => onUserEditChange(e.target, 'avatar')}
                          errors={uploadErrors['upload']}
                          fileName={avatarFileName}
                          busy={uploadAvatarState.isFetching}
                          success={!!uploadAvatarState.data}
                          disabled={uploadAvatarState.isFetching} />
              <input type="submit" className="c-button u-small-border u-margin-small"
                disabled={patchUserState.isFetching} value={patchUserState.isFetching ? t('common.saving') : t('common.save')} />
            </form>
          </div>
        </Modal>
      }
    </section>
    </>
  );
};

export default TeamMembers;
